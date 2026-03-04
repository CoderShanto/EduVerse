# ---- Vendor stage (PHP + extensions + composer) ----
FROM php:8.2-cli-alpine AS vendor

RUN apk add --no-cache git curl bash icu-dev oniguruma-dev libzip-dev zip unzip \
    && docker-php-ext-install pdo pdo_mysql mbstring intl zip

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader

# ---- Runtime stage ----
FROM php:8.2-fpm-alpine

RUN apk add --no-cache nginx bash curl icu-dev oniguruma-dev libzip-dev zip unzip \
    && docker-php-ext-install pdo pdo_mysql mbstring intl zip opcache

WORKDIR /var/www/html
COPY . .
COPY --from=vendor /app/vendor /var/www/html/vendor

COPY ./deploy/nginx.conf /etc/nginx/http.d/default.conf

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

COPY ./deploy/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]