#!/bin/sh

FILE_LOCATION=/usr/share/nginx/html/env.js

# Recreate config file
rm -rf "$FILE_LOCATION"
touch "$FILE_LOCATION"

nginx -g "daemon off;"