#!/bin/bash
# Executed by Railway before each deploy (Pre-Deploy Command).
# Runs the database migrations and rebuilds the framework caches.
set -e

php artisan migrate --force
php artisan storage:link || true
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
