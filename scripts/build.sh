#!/bin/zsh

echo "Building the frontend"

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$PROJECT_DIR/display" && npm ci && npm run build

cd "$PROJECT_DIR"
