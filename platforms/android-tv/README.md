# Android TV / Fire OS Platform Shell

## Required Assets

Place the following files in the `app/src/main/res/` directory:

- `mipmap-xhdpi/ic_launcher.png` — 96x96 app icon
- `drawable/banner.png` — 320x180 leanback banner

## Building

```bash
npm run build:android
```

Creates an `.apk` in `output/` (requires Android SDK / Gradle).

## Deploying

```bash
npm run deploy:android
```

Installs and launches on a connected Android TV or Fire TV via ADB.

## Setup: Android TV / Fire TV

### Android TV
1. Enable Developer Options (Settings > About > click Build Number 7 times)
2. Enable ADB debugging
3. Connect: `adb connect <TV_IP>`

### Fire TV
1. Enable ADB debugging (Settings > My Fire TV > Developer Options)
2. Connect: `adb connect <TV_IP>:5555`

## Notes

- The web app (`dist/`) is loaded from local assets, no server required
- WebView handles all D-pad key events as standard arrow key events
- Back button is intercepted — if the WebView has history, it goes back; otherwise the system handles it
- This same APK works on both Android TV and Fire OS
