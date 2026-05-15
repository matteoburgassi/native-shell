#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PLATFORM_DIR="$ROOT_DIR/platforms/webos"
OUTPUT_DIR="$ROOT_DIR/output/webos"

echo "==> Preparing webOS package (hosted)..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

cp "$PLATFORM_DIR/appinfo.json" "$OUTPUT_DIR"/
cp "$PLATFORM_DIR/index.html" "$OUTPUT_DIR"/

for asset in icon.png largeIcon.png splash.png; do
  if [ -f "$PLATFORM_DIR/$asset" ]; then
    cp "$PLATFORM_DIR/$asset" "$OUTPUT_DIR"/
  fi
done

if command -v ares-package &>/dev/null; then
  echo "==> Packaging .ipk..."
  ares-package --no-minify "$OUTPUT_DIR" -o "$ROOT_DIR/output"
  echo "==> Done. IPK created in output/"
else
  echo "==> ares-cli not found. Skipping .ipk packaging."
  echo "    Install: npm install -g @webos-tools/cli"
  echo "    Raw app files are in output/webos/"
fi
