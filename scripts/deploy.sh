#!/bin/bash
cd ~/codallo/nbr || exit

echo "Pulling latest code..."
git pull origin main

# Define your app name
APP_NAME="nbr-game"

# Restart or start the app
if pm2 list | grep -q "$APP_NAME"; then
    echo "Restarting PM2 app: $APP_NAME"
    pm2 restart "$APP_NAME"
else
    echo "Starting PM2 app: $APP_NAME"
    pm2 start server.js --name "$APP_NAME"
fi

# Save PM2 process list for auto-start on reboot
pm2 save

echo "Deploy finished."