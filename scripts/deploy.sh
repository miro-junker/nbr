#!/bin/zsh

# Load .env variables
set -o allexport
[ -f "$(dirname "$0")/../.env" ] && source "$(dirname "$0")/../.env"
set +o allexport

# Default app name if not set in .env
APP_NAME="${APP_NAME:-nbr-game}"

# Determine project root and log file path
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOGDIR="$PROJECT_DIR/logs"
LOGFILE="$LOGDIR/deploy.log"

# Create logs directory if it doesn't exist and set permissions
mkdir -p "$LOGDIR"
chmod 777 "$LOGDIR"
touch "$LOGFILE"
chmod 666 "$LOGFILE"

# Switch to project directory
cd "$PROJECT_DIR" || exit

# Get current commit info BEFORE pulling new code
START_COMMIT=$(git rev-parse --short HEAD)
START_COMMIT_MSG=$(git show -s --format=%s "$START_COMMIT")

# Write a line at the very beginning of the deploy
echo "$(date +"%Y-%m-%d %H:%M:%S") | Deploy started  | commit $START_COMMIT: $START_COMMIT_MSG" >> "$LOGFILE"
sync

# Run macOS notification asynchronously, only if the OS is Darwin
if [[ "$(uname)" == "Darwin" ]]; then
    osascript -e 'display notification "Deployment in progress..." with title "CI/CD auto-deploy"' &
fi

echo "***** Pulling latest code... *****"
# Measure updating duration
PULL_START=$(date +%s)
git pull origin main
PULL_END=$(date +%s)
PULL_DURATION=$((PULL_END - PULL_START))  # seconds

# Get commit info after pulling new code
END_COMMIT=$(git rev-parse --short HEAD)
END_COMMIT_MSG=$(git show -s --format=%s "$END_COMMIT")
DATE=$(date +"%Y-%m-%d %H:%M:%S")

# Install dependencies
npm ci

# Build frontend
echo "***** Building the app-display frontend *****"
./scripts/build.sh

# Write final log line
echo "$DATE | Deploy finished | commit $END_COMMIT: $END_COMMIT_MSG (took ${PULL_DURATION}s)" >> "$LOGFILE"
sync

# Start/restart the app
echo "***** Restarting the node server with PM2... *****"
if pm2 list | grep -q "$APP_NAME"; then
    pm2 restart "$APP_NAME" --update-env
else
    pm2 start server.js --name "$APP_NAME" --update-env
fi
pm2 save > /dev/null 2>&1
