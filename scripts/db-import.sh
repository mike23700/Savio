#!/usr/bin/env bash
# Import a MySQL dump into the production database container.
#
#   scripts/db-import.sh FILE [--reset]
#   RESET=1 YES=1 scripts/db-import.sh FILE
#
# The dump is streamed through sed so dumps produced on another host (with
# CREATE DATABASE / USE / GTID statements) land in MYSQL_DATABASE instead.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

ENV_FILE="$ROOT/.env"

usage() {
  cat <<'EOF'
Usage: scripts/db-import.sh FILE [--reset]

  FILE       .sql or .sql.gz dump to import
  --reset    drop and recreate the database before importing
             (also RESET=1; asks for confirmation unless YES=1)
EOF
}

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing .env. Run 'make env' first." >&2
  exit 1
fi

env_value() {
  local key="$1"
  local line
  line="$(grep -m1 -E "^${key}=" "$ENV_FILE" || true)"
  line="${line#*=}"
  line="${line%$'\r'}"
  printf '%s' "$line" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//"
}

FILE=""
RESET="${RESET:-0}"
YES="${YES:-0}"

while (($# > 0)); do
  case "$1" in
    --reset)
      RESET=1
      ;;
    --yes)
      YES=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --*)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [[ -n "$FILE" ]]; then
        echo "Only one dump file is accepted." >&2
        exit 2
      fi
      FILE="$1"
      ;;
  esac
  shift
done

if [[ -z "$FILE" ]]; then
  usage >&2
  exit 2
fi

# Support a quoted "~/dump.sql" (make usually expands the tilde already).
case "$FILE" in
  "~/"*) FILE="${HOME}/${FILE#\~/}" ;;
esac

if [[ ! -f "$FILE" ]]; then
  echo "Dump file not found: $FILE" >&2
  exit 1
fi

lower="$(printf '%s' "$FILE" | tr '[:upper:]' '[:lower:]')"
case "$lower" in
  *.sql|*.sql.gz) ;;
  *)
    echo "Unsupported dump format: $FILE (expected .sql or .sql.gz)." >&2
    exit 1
    ;;
esac

if [[ "$lower" == *.gz ]] && ! gzip -t "$FILE" 2>/dev/null; then
  echo "The .gz file is corrupt or unreadable: $FILE" >&2
  exit 1
fi

if ! docker compose ps --status running --services 2>/dev/null | grep -qx "db"; then
  echo "The db container is not running. Run 'make up' first." >&2
  exit 1
fi

DB_DATABASE="$(env_value DB_DATABASE)"
if [[ -z "$DB_DATABASE" ]]; then
  echo "DB_DATABASE is empty in .env." >&2
  exit 1
fi

if [[ "$RESET" == "1" ]]; then
  echo "WARNING: this will permanently drop the database '${DB_DATABASE}'"
  echo "inside the db container and recreate it empty. Every table and row in"
  echo "that database will be deleted. Other databases are not touched."
  if [[ "$YES" != "1" ]]; then
    printf "Type 'yes' to continue: "
    answer=""
    read -r answer || true
    if [[ "$answer" != "yes" ]]; then
      echo "Aborted." >&2
      exit 1
    fi
  fi

  # MYSQL_ROOT_PASSWORD and MYSQL_DATABASE come from the container environment,
  # so no password is placed on the host command line.
  docker compose exec -T db sh -c \
    'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -u root -e "DROP DATABASE IF EXISTS \`$MYSQL_DATABASE\`; CREATE DATABASE \`$MYSQL_DATABASE\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"'
fi

echo "Importing $FILE into database '${DB_DATABASE}'..."

# The sed pass removes statements that belong to a full-server dump:
#   CREATE DATABASE / DROP DATABASE, USE <db>;, SQL_LOG_BIN and GTID_PURGED.
# Everything else is streamed into the selected database.
if ! {
  if [[ "$lower" == *.gz ]]; then
    gzip -dc "$FILE"
  else
    cat "$FILE"
  fi
} | sed -E \
      -e '/^[[:space:]]*(CREATE|DROP)[[:space:]]+DATABASE([[:space:]]|$)/Id' \
      -e '/^[[:space:]]*USE[[:space:]]/Id' \
      -e '/SQL_LOG_BIN/Id' \
      -e '/GTID_PURGED/Id' \
  | docker compose exec -T db sh -c \
      'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -u root "$MYSQL_DATABASE"'; then
  echo "" >&2
  echo "Import failed." >&2
  echo "If the dump has no DROP TABLE statements and the tables already exist," >&2
  echo "retry with a clean database:" >&2
  echo "  make db-import FILE=$FILE RESET=1" >&2
  echo "(add YES=1 for a non-interactive run)." >&2
  exit 1
fi

echo "Import finished."

if [[ "${SKIP_MIGRATE:-0}" != "1" ]]; then
  echo "Running migrations..."
  docker compose exec -T api php artisan migrate --force
fi

echo "Done. Database ready."
