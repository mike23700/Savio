#!/usr/bin/env bash
#
# Regenerate deploy/ionos/database/savio-init.sql from the local database.
#
# The file must be generated from a database that has all migrations applied
# and the starter seeders loaded. With --fresh, this script runs
# `migrate:fresh --seed` first (DESTRUCTIVE: drops all tables in DB_DATABASE).
#
# Usage:
#   CONFIRM_FRESH=yes bash scripts/export-ionos-db.sh --fresh
#   bash scripts/export-ionos-db.sh                # dump the current DB as-is
#
# DB_* values are read from backend/.env unless already exported in the shell.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

ENV_FILE="${ENV_FILE:-backend/.env}"
OUTPUT="${OUTPUT:-backend/database/init/savio-init.sql}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "✖ $ENV_FILE not found. Create it from backend/.env.example first."
  exit 1
fi

get_env() {
  local key="$1"
  grep -E "^${key}=" "$ENV_FILE" | tail -1 | cut -d= -f2- \
    | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//"
}

DB_HOST="${DB_HOST:-$(get_env DB_HOST)}"
DB_PORT="${DB_PORT:-$(get_env DB_PORT)}"
DB_DATABASE="${DB_DATABASE:-$(get_env DB_DATABASE)}"
DB_USERNAME="${DB_USERNAME:-$(get_env DB_USERNAME)}"
DB_PASSWORD="${DB_PASSWORD:-$(get_env DB_PASSWORD)}"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"

if [[ -z "$DB_DATABASE" || -z "$DB_USERNAME" ]]; then
  echo "✖ DB_DATABASE / DB_USERNAME are not set in $ENV_FILE."
  exit 1
fi

command -v mysqldump >/dev/null 2>&1 || { echo "✖ mysqldump is not installed."; exit 1; }

if [[ "${1:-}" == "--fresh" ]]; then
  if [[ "${CONFIRM_FRESH:-}" != "yes" ]]; then
    echo "✖ --fresh drops every table in '$DB_DATABASE'."
    echo "  Re-run with: CONFIRM_FRESH=yes bash scripts/export-ionos-db.sh --fresh"
    exit 1
  fi

  echo "▶ Running migrate:fresh --seed in backend/"
  ( cd backend && php artisan migrate:fresh --seed --force )
fi

echo "▶ Dumping $DB_DATABASE from $DB_HOST:$DB_PORT"
mkdir -p "$(dirname "$OUTPUT")"

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

GTID_FLAG=()
if mysqldump --help 2>/dev/null | grep -q -- '--set-gtid-purged'; then
  GTID_FLAG=(--set-gtid-purged=OFF)
fi

MYSQL_PWD="$DB_PASSWORD" mysqldump \
  --no-defaults \
  -h "$DB_HOST" \
  -P "$DB_PORT" \
  -u "$DB_USERNAME" \
  --no-tablespaces \
  --no-create-db \
  --single-transaction \
  --quick \
  --complete-insert \
  --skip-comments \
  --default-character-set=utf8mb4 \
  "${GTID_FLAG[@]}" \
  "$DB_DATABASE" > "$TMP"

{
  echo "-- ---------------------------------------------------------------------------"
  echo "-- Paroisse Saint Dominique Savio — initial database"
  echo "-- Generated from the Laravel migrations + seeders."
  echo "--"
  echo "-- Import this file into the IONOS database (phpMyAdmin → Import)."
  echo "-- It contains DROP TABLE statements: existing tables in the target"
  echo "-- database will be replaced."
  echo "--"
  echo "-- Initial admin: admin@savio.com / 12345678"
  echo "-- CHANGE THIS PASSWORD IMMEDIATELY after the first login."
  echo "-- To use another password before importing, replace the bcrypt hash in"
  echo "-- the INSERT INTO \`users\` statement (see DEPLOYMENT.md §6.2)."
  echo "-- ---------------------------------------------------------------------------"
  echo
  cat "$TMP"
} > "$OUTPUT"

echo "✓ $OUTPUT ($(du -h "$OUTPUT" | cut -f1))"
