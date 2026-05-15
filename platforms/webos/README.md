# webOS (LG) Platform Shell

## Required Assets

Place the following files in this directory:

- `icon.png` — 80x80 app icon
- `largeIcon.png` — 130x130 large icon
- `splash.png` — 1920x1080 splash screen (optional)

## Building

```bash
npm run build:webos
```

Creates an `.ipk` package in `output/` (requires `ares-cli`).

## Deploying

```bash
npm run deploy:webos
```

Installs and launches on a connected LG TV in developer mode.

## Hosted Domain Build (DRM-safe)

If your DRM license is bound to `tv-vod.blast.dvbuilder.com`, keep using the hosted redirect shell and publish the hosted web app with a webOS-compatible bundle:

```bash
npm run build:hosted:webos
```

This generates a transpiled `dist/` bundle (mode `webos`) suitable for older webOS JS engines.

## Setup: LG Developer Mode

1. Create account at https://webostv.developer.lge.com
2. Enable Developer Mode on the TV (Settings > General > About This TV > tap "webOS TV" 5 times)
3. Install ares-cli: `npm install -g @aspect/webos-tv-cli`
4. Set up the device: `ares-setup-device`
