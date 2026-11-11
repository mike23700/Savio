#!/usr/bin/env bash
# Import the old host's storage/app/public contents into the api container's
# storage volume. Existing files are kept; files with the same name are
# overwritten by the archive.
#
#   scripts/uploads-import.sh uploads.tar.gz
#   scripts/uploads-import.sh uploads.zip
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

usage() {
  echo "Usage: scripts/uploads-import.sh FILE (.tar.gz, .tgz or .zip)" >&2
}

if [[ $# -ne 1 ]]; then
  usage
  exit 2
fi

FILE="$1"

case "$FILE" in
  "~/"*) FILE="${HOME}/${FILE#\~/}" ;;
esac

if [[ ! -f "$FILE" ]]; then
  echo "Archive not found: $FILE" >&2
  exit 1
fi

lower="$(printf '%s' "$FILE" | tr '[:upper:]' '[:lower:]')"
case "$lower" in
  *.tar.gz|*.tgz|*.zip) ;;
  *)
    echo "Unsupported archive: $FILE (expected .tar.gz, .tgz or .zip)." >&2
    exit 1
    ;;
esac

if ! docker compose ps --status running --services 2>/dev/null | grep -qx "api"; then
  echo "The api container is not running. Run 'make up' first." >&2
  exit 1
fi

tmp="$(mktemp -d "${TMPDIR:-/tmp}/savio-uploads.XXXXXX")"
cleanup() {
  rm -rf "$tmp"
}
trap cleanup EXIT

src="$tmp"

if [[ "$lower" == *.zip ]]; then
  if ! command -v unzip >/dev/null 2>&1; then
    echo "unzip is required to import a .zip archive." >&2
    exit 1
  fi
  unzip -q "$FILE" -d "$tmp"
  first="$(unzip -Z1 "$FILE" | grep -v '/$' | head -n 1 || true)"
  first="${first#./}"
  prefix=""
  case "$first" in
    storage/app/public/*) prefix="storage/app/public" ;;
    app/public/*) prefix="app/public" ;;
  esac
  if [[ -n "$prefix" && -d "$tmp/$prefix" ]]; then
    src="$tmp/$prefix"
  fi
else
  if ! command -v tar >/dev/null 2>&1; then
    echo "tar is required to import a .tar.gz archive." >&2
    exit 1
  fi
  first_raw="$(tar -tzf "$FILE" | grep -v '/$' | head -n 1 || true)"
  if [[ -z "$first_raw" ]]; then
    echo "The archive is empty: $FILE" >&2
    exit 1
  fi

  first="${first_raw#./}"
  prefix=""
  case "$first" in
    storage/app/public/*) prefix="storage/app/public" ;;
    app/public/*) prefix="app/public" ;;
  esac

  # Strip the leading path that names the old storage directory, so the files
  # land directly in storage/app/public (team/photo.jpg, homelies/audio.mp3...).
  strip=0
  if [[ "$first_raw" == ./* ]]; then
    strip=1
  fi
  if [[ -n "$prefix" ]]; then
    strip=$((strip + $(awk -F/ '{print NF}' <<< "$prefix")))
  fi

  tar -xzf "$FILE" -C "$tmp" --strip-components="$strip"
fi

count="$(find "$src" -type f | wc -l | tr -d ' ')"
if [[ "$count" == "0" ]]; then
  echo "No files found in the archive after extraction." >&2
  exit 1
fi

container_tmp="/tmp/savio-uploads-import-$$"

echo "Copying ${count} files into the api container..."
docker compose exec -T api sh -c "mkdir -p '$container_tmp'"
docker compose cp "$src/." "api:$container_tmp/"

# cp -a never deletes existing files. chown makes the imported files readable
# and replaceable by PHP-FPM (www-data).
docker compose exec -T api sh -c \
  "mkdir -p storage/app/public && cp -a '$container_tmp'/. storage/app/public/ && chown -R www-data:www-data storage/app/public && rm -rf '$container_tmp'"

echo "Imported ${count} files into storage/app/public (existing files kept)."
