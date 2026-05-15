#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DEVICE="${1:-tv}"

WGT=$(find "$ROOT_DIR/output" -maxdepth 1 -name "*.wgt" | head -1)

if [ -z "$WGT" ]; then
  echo "Error: No .wgt found in output/. Run 'npm run build:tizen' first."
  exit 1
fi

if ! command -v tizen &>/dev/null; then
  echo "Error: Tizen CLI not found."
  echo "  Install Tizen Studio: https://developer.tizen.org/development/tizen-studio/download"
  exit 1
fi

echo "==> Installing $WGT on device '$DEVICE'..."
tizen install -n "$WGT" -t "$DEVICE"
echo "==> Launching app..."
tizen run -p DigVirgo00.GalaxyTV -t "$DEVICE"
