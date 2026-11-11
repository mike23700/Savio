#!/usr/bin/env bash
# Public smoke test: API health, two API endpoints and the website document.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env. Run 'make env' first." >&2
  exit 1
fi

env_value() {
  local key="$1"
  local line
  line="$(grep -m1 -E "^${key}=" .env || true)"
  line="${line#*=}"
  line="${line%$'\r'}"
  printf '%s' "$line" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//"
}

API_URL="$(env_value API_URL)"
FRONTEND_URL="$(env_value FRONTEND_URL)"

if [[ -z "$API_URL" ]]; then
  echo "API_URL is empty in .env." >&2
  exit 1
fi

if [[ -z "$FRONTEND_URL" ]]; then
  echo "FRONTEND_URL is empty in .env." >&2
  exit 1
fi

# FRONTEND_URL is a single exact origin in production; tolerate a list.
FRONTEND_URL="${FRONTEND_URL%%,*}"
API_URL="${API_URL%/}"
API_ORIGIN="${API_URL%/api}"

urls=(
  "${API_ORIGIN}/up"
  "${API_URL}/settings"
  "${API_URL}/news?limit=1"
  "${FRONTEND_URL%/}/"
)

failed=0

for url in "${urls[@]}"; do
  code="$(curl -fsS --max-time 15 -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || true)"
  if [[ "$code" == "200" ]]; then
    echo "PASS  $url"
  else
    echo "FAIL  $url${code:+ (HTTP $code)}"
    failed=1
  fi
done

if [[ "$failed" -ne 0 ]]; then
  echo "" >&2
  echo "Smoke test failed. See VPS-DEPLOY.md troubleshooting." >&2
  exit 1
fi

echo "All smoke tests passed."
