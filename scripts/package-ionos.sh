#!/usr/bin/env bash
#
# Build IONOS-ready artifacts from the repository root.
#
#   VITE_API_URL=https://api.savio.example.com/api bash scripts/package-ionos.sh
#
# Optional values (otherwise the generated .env keeps the placeholders):
#   FRONTEND_URL=https://savio.example.com
#   DB_HOST=db-xxxx.hosting-data.io DB_PORT=3306
#   DB_DATABASE=dbsxxxx DB_USERNAME=dbxxxx DB_PASSWORD=...
#   ADMIN_EMAIL=... ADMIN_PASSWORD=...
#
# Output:
#   release/frontend/ + frontend.zip  → upload to the frontend subdomain folder
#   release/backend/  + backend.zip   → upload to the backend folder
#   release/env/backend.env           → upload once as savio-backend/.env
#   release/storage-seed/team/        → copy once into backend/storage/app/public/team/
#   release/savio-init.sql            → import once via phpMyAdmin
#   release/START-HERE.txt            → no-SSH deployment checklist
#
# The backend artifact contains vendor/ (production dependencies only), so
# Composer is NOT required on the IONOS server. No SSH/cron/Artisan is required
# for the deployment path described in START-HERE.txt: the database is imported
# from the SQL dump and the APP_KEY is pre-generated in env/backend.env.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -z "${VITE_API_URL:-}" ]]; then
  echo "✖ VITE_API_URL is required."
  echo "  Example: VITE_API_URL=https://api.savio.example.com/api bash scripts/package-ionos.sh"
  exit 1
fi

command -v npm >/dev/null 2>&1 || { echo "✖ npm is not installed."; exit 1; }
command -v php >/dev/null 2>&1 || { echo "✖ php is not installed."; exit 1; }
command -v composer >/dev/null 2>&1 || { echo "✖ composer is not installed."; exit 1; }
command -v rsync >/dev/null 2>&1 || { echo "✖ rsync is not installed."; exit 1; }
command -v zip >/dev/null 2>&1 || { echo "✖ zip is not installed."; exit 1; }

# Derive the API origin (without /api) for APP_URL.
API_ROOT="${VITE_API_URL%/}"
if [[ "$API_ROOT" == */api ]]; then
  API_ROOT="${API_ROOT%/api}"
fi

APP_URL_VALUE="${APP_URL:-$API_ROOT}"
APP_URL_VALUE="${APP_URL_VALUE%/}"
FRONTEND_URL_VALUE="${FRONTEND_URL:-}"

echo "▶ Cleaning release/"
rm -rf release
mkdir -p release/frontend release/backend release/env release/storage-seed/team

echo "▶ Checking bundled images"
LFS_POINTERS=""
for asset in logo.png pretre1.jpg pretre2.jpg pretre3.jpg pretre4.jpg logo_savio.png; do
  if [[ -f "src/imports/$asset" ]] \
    && head -c 60 "src/imports/$asset" | grep -q '^version https://git-lfs.github.com/spec/v1'; then
    LFS_POINTERS="${LFS_POINTERS}    src/imports/${asset}"$'\n'
  fi
done
if [[ -n "$LFS_POINTERS" ]]; then
  echo "⚠ Git LFS pointer files detected:"
  printf '%s' "$LFS_POINTERS"
  echo "  Run 'git lfs install && git lfs pull' before packaging, otherwise"
  echo "  the logo and the seeded team portraits will be broken."
  echo "  Packaging continues; re-run once the real images are present."
  echo
fi

echo "▶ Installing frontend dependencies (npm ci)"
npm ci --no-audit --no-fund

echo "▶ Type-checking and building the frontend"
VITE_API_URL="$VITE_API_URL" npm run build:prod

echo "▶ Writing the runtime API config"
IONOS_API_URL="$VITE_API_URL" node -e '
const fs = require("node:fs")
const url = process.env.IONOS_API_URL
fs.writeFileSync(
  "dist/config.js",
  `window.__SAVIO_CONFIG__ = {\n  apiUrl: ${JSON.stringify(url)},\n}\n`,
)
'

echo "▶ Copying the frontend build"
cp -a dist/. release/frontend/

echo "▶ Copying the Laravel application (without secrets, uploads or vendor/)"
rsync -a --delete \
  --exclude='.git/' \
  --include='.env.example' \
  --include='.env.ionos.example' \
  --exclude='.env*' \
  --exclude='vendor/' \
  --exclude='node_modules/' \
  --exclude='tests/' \
  --exclude='phpunit.xml' \
  --exclude='.phpunit.cache/' \
  --exclude='.phpunit.result.cache' \
  --exclude='Dockerfile' \
  --exclude='railway/' \
  --exclude='bootstrap/cache/*.php' \
  --exclude='storage/logs/*.log' \
  --exclude='storage/framework/cache/data/*' \
  --exclude='storage/framework/sessions/*' \
  --exclude='storage/framework/views/*' \
  --exclude='storage/app/public/*' \
  --exclude='public/storage' \
  backend/ release/backend/

echo "▶ Copying bundled portraits for TeamMemberSeeder"
mkdir -p release/backend/database/seeders/assets
for asset in pretre1.jpg pretre2.jpg pretre3.jpg pretre4.jpg logo_savio.png; do
  if [[ -f "src/imports/$asset" ]]; then
    cp "src/imports/$asset" release/backend/database/seeders/assets/
  fi
done

echo "▶ Copying the initial database dump"
if [[ -f backend/database/init/savio-init.sql ]]; then
  cp backend/database/init/savio-init.sql release/savio-init.sql
  cp backend/database/init/README.md release/DATABASE-README.md
else
  echo "⚠ backend/database/init/savio-init.sql is missing."
  echo "  Generate it with: CONFIRM_FRESH=yes bash scripts/export-ionos-db.sh --fresh"
fi

echo "▶ Preparing the one-time seed uploads (team portraits)"
copy_seed_upload() {
  local source="src/imports/$1"
  local target="release/storage-seed/team/$2"

  if [[ ! -f "$source" ]]; then
    echo "⚠ Missing $source — $target will be absent."
    return
  fi

  if head -c 60 "$source" | grep -q '^version https://git-lfs.github.com/spec/v1'; then
    echo "⚠ $source is a Git LFS pointer — $target will be broken."
    return
  fi

  cp "$source" "$target"
}

copy_seed_upload pretre2.jpg fankam-ngandjui.jpg
copy_seed_upload logo_savio.png kamga.png
copy_seed_upload pretre1.jpg pandeu-tatsi.jpg
copy_seed_upload pretre3.jpg gwodog-tang.jpg
copy_seed_upload pretre4.jpg mbekou.jpg

echo "▶ Creating Laravel runtime directories"
mkdir -p \
  release/backend/bootstrap/cache \
  release/backend/storage/app/public \
  release/backend/storage/framework/cache/data \
  release/backend/storage/framework/sessions \
  release/backend/storage/framework/views \
  release/backend/storage/logs

echo "▶ Installing production PHP dependencies into release/backend/vendor"
composer install \
  --working-dir=release/backend \
  --no-dev \
  --no-interaction \
  --prefer-dist \
  --optimize-autoloader

# Composer may have generated files with the local PHP version; that is fine
# because IONOS will regenerate its own caches if it ever gets SSH access.

echo "▶ Preparing the production .env (pre-generated APP_KEY)"
cp backend/.env.ionos.example release/env/backend.env

APP_KEY_VALUE="$(php -r 'echo "base64:".base64_encode(random_bytes(32));')"
export APP_KEY_VALUE APP_URL_VALUE FRONTEND_URL_VALUE
export DB_HOST_VALUE="${DB_HOST:-}" DB_PORT_VALUE="${DB_PORT:-}"
export DB_DATABASE_VALUE="${DB_DATABASE:-}" DB_USERNAME_VALUE="${DB_USERNAME:-}"
export DB_PASSWORD_VALUE="${DB_PASSWORD:-}"
# Match the admin row that savio-init.sql creates, so a later accidental
# `db:seed` finds the existing account instead of creating a second admin.
export ADMIN_EMAIL_VALUE="${ADMIN_EMAIL:-admin@savio.com}"
export ADMIN_PASSWORD_VALUE="${ADMIN_PASSWORD:-12345678}"

php -r '
$path = "release/env/backend.env";
$s = file_get_contents($path);
$keys = [
    "APP_KEY", "APP_URL", "FRONTEND_URL",
    "DB_HOST", "DB_PORT", "DB_DATABASE", "DB_USERNAME", "DB_PASSWORD",
    "ADMIN_EMAIL", "ADMIN_PASSWORD",
];
foreach ($keys as $key) {
    $value = getenv($key."_VALUE");
    if ($value === false || $value === "") {
        continue;
    }
    $s = preg_replace_callback(
        "/^".preg_quote($key, "/")."=.*$/m",
        fn () => $key."=".$value,
        $s,
    );
}
file_put_contents($path, $s);
'
chmod 600 release/env/backend.env

echo "▶ Writing the no-SSH checklist"
cp DEPLOYMENT.md release/DEPLOYMENT.md

cat > release/START-HERE.txt <<'TXT'
PAROISSE SAINT DOMINIQUE SAVIO — IONOS DEPLOYMENT (NO SSH / NO SCRIPT)
========================================================================

This package is self-contained: no Composer, no Node, no SSH, no cron and no
Artisan command is required on IONOS. Everything is either pre-built or
included as a one-time file to upload.

1. IONOS control panel
   - Create the MySQL database and database user.
   - Create the two subdomains and connect them to folders:
       frontend.example.com  -> savio-frontend/
       api.example.com       -> savio-backend/public/   (NOT savio-backend!)
   - Enable SSL on both subdomains.
   - Set PHP 8.2+ for the API subdomain (extensions pdo_mysql, mbstring,
     openssl, tokenizer, dom, fileinfo, curl, gd).

2. Upload the frontend
   - Upload frontend.zip into savio-frontend/ and extract it.
   - Verify savio-frontend/.htaccess exists (hidden files must be included).
   - If your API domain differs from the one used at packaging time, edit
     savio-frontend/config.js and set:
         window.__SAVIO_CONFIG__ = { apiUrl: "https://api.example.com/api" }
     No rebuild is needed; this file is read at runtime.

3. Upload the backend
   - Upload backend.zip into savio-backend/ and extract it.
   - Verify savio-backend/public/index.php and savio-backend/public/.htaccess.

4. Create the backend .env (once)
   - Upload env/backend.env as savio-backend/.env  (it already contains a
     generated APP_KEY; do not regenerate it later).
   - Edit these values in that file:
       APP_URL       = https://api.example.com
       FRONTEND_URL  = https://frontend.example.com,https://www.frontend.example.com
       DB_HOST       = (IONOS database host, e.g. db-xxxx.hosting-data.io)
       DB_DATABASE   = (IONOS database name)
       DB_USERNAME   = (IONOS database user)
       DB_PASSWORD   = (IONOS database password)
   - Keep APP_ENV=production, APP_DEBUG=false, FORCE_HTTPS=true.
   - ADMIN_EMAIL/ADMIN_PASSWORD are only used if you run seeders later; the
     imported database already contains admin@savio.com / 12345678.
   - No `php artisan key:generate`, no `config:cache`, no `route:cache` needed.

5. Import the initial database (once)
   - Open phpMyAdmin for the IONOS database.
   - Import savio-init.sql (also available at savio-backend/database/init/).
   - The file creates all tables and loads ALL starter content.
   - Initial admin: admin@savio.com / 12345678
     -> log in at https://frontend.example.com/admin and change it immediately.

6. Copy the seeded team photos (once)
   - Upload the contents of storage-seed/team/ into:
       savio-backend/storage/app/public/team/
   - Filenames: fankam-ngandjui.jpg, kamga.png, pandeu-tatsi.jpg,
     gwodog-tang.jpg, mbekou.jpg.

7. If the site returns a 500 error
   - Make sure these folders are writable by PHP (755 or 775):
       savio-backend/storage/
       savio-backend/bootstrap/cache/
   - In IONOS File Manager: right-click the folder -> Permissions.
   - Check savio-backend/storage/logs/ (if PHP can write there).
   - The API subdomain MUST point to savio-backend/public/, not savio-backend/.

8. Updates (later deployments)
   - Upload only the new frontend build and the changed backend code.
   - NEVER overwrite savio-backend/.env (it contains APP_KEY and DB credentials).
   - NEVER delete savio-backend/storage/app/public/ (uploaded images, audio, PDFs).
   - Do not re-import savio-init.sql on an existing site: it DROPS all tables.
   - No SSH is needed for code-only updates. If a future release adds
     migrations, apply the corresponding SQL changes in phpMyAdmin (the
     savio-init.sql dump is only for a fresh installation).

More details: DEPLOYMENT.md and DATABASE-README.md.
TXT

echo "▶ Creating archives"
( cd release/frontend && zip -qr ../frontend.zip . )
( cd release/backend && zip -qr ../backend.zip . )

echo
echo "✓ Release ready:"
du -sh \
  release/frontend release/backend \
  release/frontend.zip release/backend.zip \
  release/env/backend.env release/storage-seed release/savio-init.sql
echo
echo "Next: open release/START-HERE.txt and follow the no-SSH checklist."
