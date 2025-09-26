#!/bin/zsh

echo "Cleaning up logs..."

# Clear the app log file
> /Users/cdl_srv/.pm2/logs/nbr-game-out.log

# Clean up deploy log
> "$HOME/codallo/nbr/logs/deploy.log"
