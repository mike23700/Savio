#!/usr/bin/env bash
#
# Copy the bundled team portraits into storage/app/public/team.
#
# `php artisan db:seed --class=TeamMemberSeeder` already does this. This script
# is for the "import savio-init.sql via phpMyAdmin" path, where Artisan is not
# available: the SQL references team/<slug>.<ext>, so the files must exist.
#
# Usage (from the backend root):
#   bash deploy/ionos/seed-uploads.sh

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$APP_DIR"

ASSETS="database/seeders/assets"
DEST="storage/app/public/team"

mkdir -p "$DEST"

copy_seed() {
  local source="$ASSETS/$1"
  local target="$DEST/$2"

  if [[ ! -f "$source" ]]; then
    echo "⚠ Missing $source — skipping $target"
    return
  fi

  if head -c 60 "$source" | grep -q '^version https://git-lfs.github.com/spec/v1'; then
    echo "⚠ $source is still a Git LFS pointer — run 'git lfs pull' and retry."
    return
  fi

  if [[ -f "$target" ]]; then
    echo "ℹ $target already exists — keeping it"
    return
  fi

  cp "$source" "$target"
  echo "✓ $target"
}

# Keep this mapping in sync with TeamMemberSeeder (photo_file).
copy_seed pretre2.jpg fankam-ngandjui.jpg
copy_seed logo_savio.png kamga.png
copy_seed pretre1.jpg pandeu-tatsi.jpg
copy_seed pretre3.jpg gwodog-tang.jpg
copy_seed pretre4.jpg mbekou.jpg

echo "Done. Seeded uploads are in $DEST"
