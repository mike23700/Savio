#!/bin/sh
# Point d'entrée du conteneur Railway (voir backend/Dockerfile).
# Prépare l'application puis démarre le serveur PHP.
set -e

# Dossiers runtime absents du dépôt (gitignorés) mais requis par Laravel
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views \
         storage/logs storage/app/public bootstrap/cache

php artisan migrate --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8080}"
