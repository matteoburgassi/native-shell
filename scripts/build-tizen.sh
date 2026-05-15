#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PLATFORM_DIR="$ROOT_DIR/platforms/tizen"
OUTPUT_DIR="$ROOT_DIR/output/tizen"

echo "==> Preparing Tizen package (hosted)..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

cp "$PLATFORM_DIR/config.xml" "$OUTPUT_DIR"/
cp "$PLATFORM_DIR/index.html" "$OUTPUT_DIR"/

for asset in icon.png; do
  if [ -f "$PLATFORM_DIR/$asset" ]; then
    cp "$PLATFORM_DIR/$asset" "$OUTPUT_DIR"/
  fi
done

if command -v tizen &>/dev/null; then
  echo "==> Packaging .wgt..."
  tizen package -t wgt -s "$OUTPUT_DIR" -- "$OUTPUT_DIR"
  mv "$OUTPUT_DIR"/*.wgt "$ROOT_DIR/output/" 2>/dev/null || true
  echo "==> Done. WGT created in output/"
else
  echo "==> Tizen CLI not found. Skipping .wgt packaging."
  echo "    Install Tizen Studio: https://developer.tizen.org/development/tizen-studio/download"
  echo "    Raw app files are in output/tizen/"
fi
