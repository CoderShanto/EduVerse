#!/usr/bin/env bash
set -e

export PORT=${PORT:-80}

# -----------------------------------------
# Ensure writable dirs for Laravel + uploads
# -----------------------------------------
mkdir -p /var/www/html/storage/framework/{cache,sessions,views}
mkdir -p /var/www/html/bootstrap/cache

mkdir -p /var/www/html/public/uploads/course/small
mkdir -p /var/www/html/public/uploads/course/videos

# Fix ownership + permissions (php-fpm runs as www-data)
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads

# -----------------------------------------
# Laravel optimizations (don't hard-fail)
# -----------------------------------------
php artisan package:discover --ansi || true
php artisan config:cache || true
php artisan route:cache  || true
php artisan view:cache   || true

# -----------------------------------------
# DB migrations (optional, keep true)
# -----------------------------------------
php artisan migrate --force || true

# -----------------------------------------
# Start services
# -----------------------------------------
php-fpm -D
sed -i "s/listen 80;/listen ${PORT};/g" /etc/nginx/http.d/default.conf
nginx -g "daemon off;"