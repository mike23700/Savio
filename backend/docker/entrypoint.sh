#!/bin/sh
# Container entrypoint: wait for MySQL, prepare writable directories, apply
# migrations and caches, then hand over to PHP-FPM.
set -eu

if [ -z "${APP_KEY:-}" ]; then
    echo "ERROR: APP_KEY is empty. Run 'make env' on the host and set APP_KEY in .env." >&2
    exit 1
fi

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-3306}"
DB_DATABASE="${DB_DATABASE:-}"
DB_USERNAME="${DB_USERNAME:-}"
DB_PASSWORD="${DB_PASSWORD:-}"

export DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD

echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT} (database ${DB_DATABASE})..."

attempt=1
max_attempts=60

while [ "${attempt}" -le "${max_attempts}" ]; do
    if php -r '
        $dsn = sprintf(
            "mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4",
            getenv("DB_HOST"),
            getenv("DB_PORT"),
            getenv("DB_DATABASE")
        );

        try {
            new PDO($dsn, getenv("DB_USERNAME"), getenv("DB_PASSWORD"), [
                PDO::ATTR_TIMEOUT => 3,
            ]);
        } catch (Throwable $e) {
            exit(1);
        }

        exit(0);
    ' 2>/dev/null; then
        echo "MySQL is ready."
        break
    fi

    if [ "${attempt}" -eq "${max_attempts}" ]; then
        echo "ERROR: MySQL is not reachable after ${max_attempts}s. Check the db service logs." >&2
        exit 1
    fi

    sleep 1
    attempt=$((attempt + 1))
done

mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache

# The public disk is served by Laravel's /storage route, but the symlink keeps
# the standard Laravel behaviour for any tooling that expects it.
php artisan storage:link || true

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec php-fpm
