#!/usr/bin/env bash
# Create the production .env from .env.docker.example and generate the secrets
# that must never be typed by hand. Refuses to overwrite an existing .env.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -e .env ]]; then
  echo "Refusing to overwrite existing $ROOT/.env." >&2
  echo "Delete it yourself first if you really want a fresh environment." >&2
  exit 1
fi

if [[ ! -f .env.docker.example ]]; then
  echo "Missing .env.docker.example at $ROOT." >&2
  exit 1
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "openssl is required to generate APP_KEY and database passwords." >&2
  exit 1
fi

umask 077
cp .env.docker.example .env

app_key="base64:$(openssl rand -base64 32)"
db_password="$(openssl rand -hex 16)"
db_root_password="$(openssl rand -hex 16)"

sed -i "s|^APP_KEY=.*|APP_KEY=${app_key}|" .env
sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=${db_password}|" .env
sed -i "s|^DB_ROOT_PASSWORD=.*|DB_ROOT_PASSWORD=${db_root_password}|" .env

chmod 600 .env

cat <<'EOF'
Created .env with APP_KEY, DB_PASSWORD and DB_ROOT_PASSWORD generated.

Next steps:
  1. Edit .env and check APP_URL, FRONTEND_URL, API_URL and
     SANCTUM_STATEFUL_DOMAINS for your real domains.
  2. Add the Peex keys if mobile money is enabled.
  3. Run `make deploy` to build the frontend and start db + api.
  4. Import the database and uploads (see VPS-DEPLOY.md).

Keep .env private: chmod 600 is already applied and the file is git-ignored.
EOF
