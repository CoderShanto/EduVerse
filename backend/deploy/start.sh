#!/usr/bin/env bash
set -e

# If Render provides PORT, use it; otherwise default to 80
export PORT=${PORT:-80}

# Laravel cache warmup (safe even without .env file committed; Render env vars are used)
php artisan config:cache || true
php artisan route:cache  || true
php artisan view:cache   || true

# Run migrations automatically on deploy (recommended for personal projects)
php artisan migrate --force || true

# Start php-fpm + nginx
php-fpm -D
# Make nginx listen on Render PORT
sed -i "s/listen 80;/listen ${PORT};/g" /etc/nginx/http.d/default.conf
nginx -g "daemon off;"