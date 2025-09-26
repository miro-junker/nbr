#!/bin/zsh


# Clear the log file
#> /Users/cdl_srv/.pm2/logs/nbr-game-out.log

# Clear terminal
clear

# Run terminal
exec tail -f /Users/cdl_srv/.pm2/logs/nbr-game-out.log

