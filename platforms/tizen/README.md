# Tizen (Samsung) Platform Shell

## Required Assets

Place the following files in this directory:

- `icon.png` — 512x512 app icon

## Building

```bash
npm run build:tizen
```

Creates a `.wgt` package in `output/` (requires Tizen Studio CLI).

## Deploying

```bash
npm run deploy:tizen
```

Installs and launches on a connected Samsung TV in developer mode.

## Setup: Samsung Developer Mode

1. Create account at https://developer.samsung.com/smarttv
2. Enable Developer Mode on the TV (Settings > go to Smart Hub > Apps > enter 12345 on remote)
3. Install Tizen Studio: https://developer.tizen.org/development/tizen-studio/download
4. Connect to the TV: `sdb connect <TV_IP>`
