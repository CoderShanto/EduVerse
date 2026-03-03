# ---- Build stage (composer) ----
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader

# ---- Runtime stage ----
FROM php:8.2-fpm-alpine

# System deps + PHP extensions needed for Laravel + MySQL
RUN apk add --no-cache nginx bash curl icu-dev oniguruma-dev libzip-dev zip unzip \
    && docker-php-ext-install pdo pdo_mysql mbstring intl zip opcache

WORKDIR /var/www/html

# Copy app
COPY . .

# Copy vendor from build stage
COPY --from=vendor /app/vendor /var/www/html/vendor

# Nginx config
COPY ./deploy/nginx.conf /etc/nginx/http.d/default.conf

# Permissions (storage + cache)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

# Start script
COPY ./deploy/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]