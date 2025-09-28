#!/bin/zsh

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$PROJECT_DIR/app-display" && npm ci && npm run build

cd "$PROJECT_DIR"
