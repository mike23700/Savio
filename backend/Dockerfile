# Conteneur du backend Laravel pour Railway.
# Ce fichier est prévu pour un contexte de build = backend/ (Root Directory).
FROM php:8.2-cli-alpine

# Extensions PHP requises par l'API (MySQL, intl, zip, bcmath, opcache)
RUN apk add --no-cache icu-dev libzip-dev \
    && docker-php-ext-install pdo_mysql intl zip bcmath opcache

# Le serveur PHP intégré gère plusieurs requêtes en parallèle
ENV PHP_CLI_SERVER_WORKERS=8

WORKDIR /app

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Dépendances PHP d'abord (meilleure réutilisation du cache Docker)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --optimize-autoloader

# Code de l'application
COPY . ./

CMD ["sh", "railway/start.sh"]
