#!/bin/zsh

echo "Cleaning up logs..."

# Clear the log file
> /Users/cdl_srv/.pm2/logs/nbr-game-out.log

# Clean up deploy log
> ../logs/deploy.log
