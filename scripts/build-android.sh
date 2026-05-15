#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PLATFORM_DIR="$ROOT_DIR/platforms/android-tv"

echo "==> Building Android TV APK (hosted)..."

if [ -f "$PLATFORM_DIR/gradlew" ]; then
  cd "$PLATFORM_DIR"
  ./gradlew assembleDebug
  mkdir -p "$ROOT_DIR/output"
  cp app/build/outputs/apk/debug/*.apk "$ROOT_DIR/output/" 2>/dev/null || true
  echo "==> Done. APK created in output/"
elif command -v gradle &>/dev/null; then
  cd "$PLATFORM_DIR"
  gradle assembleDebug
  mkdir -p "$ROOT_DIR/output"
  cp app/build/outputs/apk/debug/*.apk "$ROOT_DIR/output/" 2>/dev/null || true
  echo "==> Done. APK created in output/"
else
  echo "==> Gradle not found. Skipping APK build."
  echo "    Install Android Studio or add the Gradle wrapper."
fi
