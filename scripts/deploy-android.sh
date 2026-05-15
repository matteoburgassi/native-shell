#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

APK=$(find "$ROOT_DIR/output" -maxdepth 1 -name "*.apk" | head -1)

if [ -z "$APK" ]; then
  echo "Error: No .apk found in output/. Run 'npm run build:android' first."
  exit 1
fi

if ! command -v adb &>/dev/null; then
  echo "Error: adb not found. Install Android SDK platform-tools."
  exit 1
fi

echo "==> Installing $APK..."
adb install -r "$APK"
echo "==> Launching app..."
adb shell am start -n com.digitalvirgo.galaxytv/.MainActivity
