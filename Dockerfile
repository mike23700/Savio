# Conteneur du backend Laravel pour Railway.
# Ce fichier est prévu pour un contexte de build = racine du repo.
# (La variante backend/Dockerfile couvre le cas Root Directory = backend.)
FROM php:8.2-cli-alpine

# Extensions PHP requises par l'API (MySQL, intl, zip, bcmath, opcache)
RUN apk add --no-cache icu-dev libzip-dev \
    && docker-php-ext-install pdo_mysql intl zip bcmath opcache

# Le serveur PHP intégré gère plusieurs requêtes en parallèle
ENV PHP_CLI_SERVER_WORKERS=8

WORKDIR /app

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Dépendances PHP d'abord (meilleure réutilisation du cache Docker)
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --optimize-autoloader

# Code de l'application
COPY backend/ ./

CMD ["sh", "railway/start.sh"]
