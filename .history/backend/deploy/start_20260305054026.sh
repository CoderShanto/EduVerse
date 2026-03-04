#!/usr/bin/env bash
set -e

export PORT=${PORT:-80}

# --------------------------------
# Ensure writable Laravel folders
# --------------------------------
mkdir -p /var/www/html/storage/framework/{cache,sessions,views} || true
mkdir -p /var/www/html/bootstrap/cache || true
mkdir -p /var/www/html/public/uploads/course/small || true
mkdir -p /var/www/html/public/uploads/course/videos || true

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads || true
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads || true

# --------------------------------
# Laravel optimizations
# --------------------------------
php artisan package:discover --ansi || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# --------------------------------
# Run migrations
# --------------------------------
php artisan migrate --force || true

# --------------------------------
# Start services
# --------------------------------
php-fpm -D
sed -i "s/listen 80;/listen ${PORT};/g" /etc/nginx/http.d/default.conf
nginx -g "daemon off;"