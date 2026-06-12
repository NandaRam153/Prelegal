#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "▶ Building and starting Prelegal..."
docker compose up --build -d

echo "✓ Prelegal is running at http://localhost:8000"
