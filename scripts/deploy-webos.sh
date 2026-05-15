#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET="${1:-simulator}"

if ! command -v ares-launch &>/dev/null; then
  echo "Error: ares-cli not found."
  echo "  Install: npm install -g @webos-tools/cli"
  exit 1
fi

if [ "$TARGET" = "simulator" ] || [ "$TARGET" = "sim" ]; then
  SIM_VERSION="${2:-25}"
  SIM_PATH="${3:-/Applications}"
  APP_DIR="$ROOT_DIR/output/webos"

  if [ ! -d "$APP_DIR" ]; then
    echo "Error: output/webos/ not found. Run 'npm run build:webos' first."
    exit 1
  fi

  echo "==> Launching on webOS TV $SIM_VERSION Simulator..."
  ares-launch -s "$SIM_VERSION" "$APP_DIR" -sp "$SIM_PATH"
else
  IPK=$(find "$ROOT_DIR/output" -maxdepth 1 -name "*.ipk" | head -1)

  if [ -z "$IPK" ]; then
    echo "Error: No .ipk found in output/. Run 'npm run build:webos' first."
    exit 1
  fi

  echo "==> Installing $IPK on device '$TARGET'..."
  ares-install --device "$TARGET" "$IPK"
  echo "==> Launching app..."
  ares-launch --device "$TARGET" com.digitalvirgo.galaxytv
fi
