#!/usr/bin/env bash
# Write a compressed database backup to backups/savio-YYYYmmdd-HHMMSS.sql.gz.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env. Run 'make env' first." >&2
  exit 1
fi

if ! docker compose ps --status running --services 2>/dev/null | grep -qx "db"; then
  echo "The db container is not running. Run 'make up' first." >&2
  exit 1
fi

mkdir -p backups

stamp="$(date +%Y%m%d-%H%M%S)"
out="backups/savio-${stamp}.sql.gz"

# MYSQL_PWD and MYSQL_DATABASE are read inside the container: the root password
# never appears in host process arguments. --single-transaction keeps InnoDB
# tables consistent without locking the site for the duration of the dump.
if ! docker compose exec -T db sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqldump -u root \
     --single-transaction \
     --quick \
     --routines \
     --triggers \
     --events \
     --no-tablespaces \
     --default-character-set=utf8mb4 \
     "$MYSQL_DATABASE"' | gzip -c > "$out"; then
  rm -f "$out"
  echo "Database dump failed; no backup file was kept." >&2
  exit 1
fi

size="$(du -h "$out" | cut -f1)"
echo "Backup written: $ROOT/$out (${size})"
