#!/usr/bin/env bash
set -e

export PORT=${PORT:-80}

# Run package discovery at runtime (Render env vars available here)
php artisan package:discover --ansi || true

php artisan config:cache || true
php artisan route:cache  || true
php artisan view:cache   || true

php artisan migrate --force || true

php-fpm -D
sed -i "s/listen 80;/listen ${PORT};/g" /etc/nginx/http.d/default.conf
nginx -g "daemon off;"