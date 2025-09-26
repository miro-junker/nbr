#!/bin/bash

# Determine project root and log file path
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOGDIR="$PROJECT_DIR/logs"
LOGFILE="$LOGDIR/deploy.log"

# Create logs directory if it doesn't exist and set permissions
mkdir -p "$LOGDIR"
chmod 777 "$LOGDIR"
touch "$LOGFILE"
chmod 666 "$LOGFILE"

# Write a line at the very beginning of the deploy
echo "=== Deploy started at $(date +"%Y-%m-%d %H:%M:%S") ===" >> "$LOGFILE"
sync

# Run macOS notification asynchronously, only if the OS is Darwin
if [[ "$(uname)" == "Darwin" ]]; then
    osascript -e 'display notification "Deploy script was called" with title "Deploy Notification"' &
fi

# Move to project directory
cd "$PROJECT_DIR" || exit

# Pull latest code
git_output=$(git pull origin main)

# Get commit info
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

# Write final log line
echo "$DATE | $CURRENT_COMMIT | $COMMIT_MSG | $git_output" >> "$LOGFILE"
sync
