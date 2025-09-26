#!/bin/bash

# Run macOS notification asynchronously, only if the OS is Darwin (macOS)
if [[ "$(uname)" == "Darwin" ]]; then
    osascript -e 'display notification "Deploy script was called" with title "Deploy Notification"' &
fi

# Relative log file path
LOGDIR="./logs"
LOGFILE="$LOGDIR/deploy.log"

# Create logs directory if it doesn't exist, give full access
mkdir -p "$LOGDIR"
chmod 777 "$LOGDIR"

# Ensure the log file exists and is world-writable
touch "$LOGFILE"
chmod 666 "$LOGFILE"

# Move to project directory
cd "$HOME/codallo/nbr" || exit

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

# Always write a single-line log and flush immediately
echo "$DATE | $CURRENT_COMMIT | $COMMIT_MSG | $git_output" >> "$LOGFILE"
sync
