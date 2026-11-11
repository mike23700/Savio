#!/usr/bin/env bash
#
# Prepare the Laravel API on the IONOS server.
#
# Run it from the backend root (the folder containing artisan):
#   bash deploy/ionos/setup.sh              # first deploy without demo content
#   bash deploy/ionos/setup.sh --seed       # first deploy + starter content
#
# Requirements: PHP CLI 8.2+ (SSH), or run the equivalent commands through a
# one-off IONOS cron job. Composer is not needed: the release artifact already
# contains vendor/.

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$APP_DIR"

PHP_BIN="${PHP_BIN:-php}"

if [[ ! -f .env ]]; then
  echo "✖ backend/.env is missing."
  echo "  Copy .env.ionos.example to .env, fill in the database and URLs, then retry."
  exit 1
fi

if ! "$PHP_BIN" -r 'exit(PHP_VERSION_ID >= 80200 ? 0 : 1);'; then
  echo "✖ PHP 8.2 or newer is required (current: $("$PHP_BIN" -r 'echo PHP_VERSION;'))."
  echo "  Select PHP 8.2+ in the IONOS PHP settings for the API subdomain."
  exit 1
fi

if ! "$PHP_BIN" -r 'exit(extension_loaded("pdo_mysql") ? 0 : 1);'; then
  echo "✖ The pdo_mysql PHP extension is not enabled for this PHP binary."
  echo "  Enable it in the IONOS PHP settings for the API subdomain."
  exit 1
fi

echo "▶ Runtime directories"
mkdir -p \
  storage/app/public \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/views \
  storage/logs \
  bootstrap/cache

chmod -R ug+rwX storage bootstrap/cache || true

if ! grep -Eq '^APP_KEY="?base64:.+' .env; then
  echo "▶ Generating APP_KEY"
  "$PHP_BIN" artisan key:generate --force
fi

# Clear any cached configuration first, otherwise migrate/seed would keep using
# the values from the previous deployment.
echo "▶ Clearing stale framework caches"
"$PHP_BIN" artisan config:clear
"$PHP_BIN" artisan route:clear
"$PHP_BIN" artisan view:clear

echo "▶ Running database migrations"
"$PHP_BIN" artisan migrate --force

if [[ -L public/storage && ! -e public/storage ]]; then
  echo "⚠ public/storage is a broken symlink — removing it"
  rm -f public/storage
fi

if [[ -e public/storage || -L public/storage ]]; then
  echo "ℹ public/storage already exists — skipping storage:link"
else
  echo "▶ Linking public/storage"
  "$PHP_BIN" artisan storage:link || {
    echo "⚠ storage:link failed (symlinks may be disabled)."
    echo "  The /storage/{path} fallback route will serve uploaded files instead."
  }
fi

if [[ "${1:-}" == "--seed" ]]; then
  echo "▶ Seeding starter content (first deployment only)"
  "$PHP_BIN" artisan db:seed --force
else
  echo "ℹ Skipping seeders. Use --seed on a brand-new database."
fi

echo "▶ Building production caches"
"$PHP_BIN" artisan config:cache
"$PHP_BIN" artisan route:cache
"$PHP_BIN" artisan view:cache

echo
echo "✓ Backend ready."
echo "  Check: $(grep '^APP_URL=' .env | cut -d= -f2-)/up"
echo "  Admin: $(grep '^FRONTEND_URL=' .env | cut -d= -f2- | cut -d, -f1)/admin"
