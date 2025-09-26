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

# Move to project directory
cd "$PROJECT_DIR" || exit

# Get current commit info BEFORE pulling new code
START_COMMIT=$(git rev-parse --short HEAD)
START_COMMIT_MSG=$(git show -s --format=%s "$START_COMMIT")

# Write a line at the very beginning of the deploy
echo "$(date +"%Y-%m-%d %H:%M:%S") | Deploy started | commit $START_COMMIT: $START_COMMIT_MSG" >> "$LOGFILE"
sync

# Run macOS notification asynchronously, only if the OS is Darwin
if [[ "$(uname)" == "Darwin" ]]; then
    osascript -e 'display notification "Deploy script was called" with title "Deploy Notification"' &
fi

# Pull latest code
git pull origin main > /dev/null 2>&1

# Get updated commit info AFTER pulling new code
END_COMMIT=$(git rev-parse --short HEAD)
END_COMMIT_MSG=$(git show -s --format=%s "$END_COMMIT")
DATE=$(date +"%Y-%m-%d %H:%M:%S")

# Write final log line before restarting the app
echo "$DATE | Deploy finished | commit $END_COMMIT: $END_COMMIT_MSG" >> "$LOGFILE"
sync

# Start/restart the app
APP_NAME="nbr-game"
if pm2 list | grep -q "$APP_NAME"; then
    pm2 restart "$APP_NAME" --update-env > /dev/null 2>&1
else
    pm2 start server.js --name "$APP_NAME" --update-env > /dev/null 2>&1
fi
pm2 save > /dev/null 2>&1
