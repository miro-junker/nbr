#!/bin/bash

# TODO: notification temporarily disabled
# osascript -e 'display notification "Deploy script was called" with title "Deploy Notification"'

# Log file
LOGFILE="$HOME/codallo/nbr/logs/deploy.log"
mkdir -p "$(dirname "$LOGFILE")"

cd "$HOME/codallo/nbr" || exit

# Pull latest code
git_output=$(git pull origin main)

# Get commit info (even if unchanged)
CURRENT_COMMIT=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=%s)
DATE=$(date +"%Y-%m-%d %H:%M:%S")

# PM2 app
APP_NAME="nbr-game"
if pm2 list | grep -q "$APP_NAME"; then
    pm2 restart "$APP_NAME" --update-env > /dev/null 2>&1
else
    pm2 start server.js --name "$APP_NAME" --update-env > /dev/null 2>&1
fi
pm2 save > /dev/null 2>&1

# Always write a single-line log
echo "$DATE | $CURRENT_COMMIT | $COMMIT_MSG | $git_output" >> "$LOGFILE"
