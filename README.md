# TV Shell - Smart TV App Development Kit

A complete starter template for building Smart TV applications with maximum platform coverage and AI-accelerated development.

## 🎯 Overview

This repository provides production-ready native shells for all major Smart TV platforms, designed to work seamlessly with AI development tools like **Bolt.new** and **Cursor** for rapid iteration.

### Supported Platforms

| Platform | Architecture | Market Coverage | Development Approach |
|----------|-------------|-----------------|---------------------|
| **webOS (LG)** | Hybrid Web App | ~25% | HTML5 shell + Web App |
| **Tizen (Samsung)** | Hybrid Web App | ~30% | HTML5 shell + Web App |
| **Android TV/Google TV** | Hybrid Web App | ~40% | Native shell + WebView |
| **Apple TV (tvOS)** | React Native | ~15% | React Native + Expo |

**Total Market Coverage: ~110%** (overlapping market share)

## 🏗️ Architecture

This project implements a **multi-architecture approach** optimized for different platform capabilities:

### Hybrid Web App (webOS, Tizen, Android TV)
- **Frontend**: React SPA with Vite, TypeScript, Tailwind CSS
- **Navigation**: Spatial navigation for TV remotes (`@noriginmedia/norigin-spatial-navigation`)
- **Playback**: DRM-enabled video player ([`@digitalvirgo/drm-player`](https://github.com/matteoburgassi/drm-player))
- **Authentication**: Device code flow optimized for TV UX
- **Deployment**: Over-the-air updates via hosted web app

### Native React Native (Apple TV)
- **Framework**: React Native + Expo with tvOS target
- **Navigation**: Native focus engine with TV-optimized components  
- **Code Sharing**: ~90% shared with smartphone versions
- **Deployment**: App Store distribution

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- For Apple TV: Xcode 15+ and Apple Developer Account
- For Android TV: Android Studio and Android SDK
- For webOS: LG webOS SDK (`ares-cli`)
- For Tizen: Tizen Studio

### 1. Clone and Install
```bash
git clone https://github.com/matteoburgassi/tv-shell.git
cd tv-shell
npm install
```

### 2. Start Development Server (Web App)
```bash
npm run dev
# Starts Vite dev server at http://localhost:5173
```

### 3. Platform-Specific Setup

#### webOS (LG TVs)
```bash
cd webos
# Update index.html to point to your dev server
# Package and install on LG TV or simulator
ares-package .
ares-install com.digitalvirgo.galaxytv_1.0.0_all.ipk -d tv-simulator
```

#### Tizen (Samsung TVs)
```bash
cd tizen  
# Update index.html to point to your dev server
# Build and install via Tizen CLI
tizen build-web
tizen install -n GalaxyTV.wgt -t tv-simulator
```

#### Android TV
```bash
cd android-tv
# Update WebView URL in MainActivity.kt
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

#### Apple TV (React Native)
```bash
cd apple-tv
npm install
npx expo start
# Press 'i' for iOS simulator, select Apple TV
```

## 🤖 AI-Accelerated Development

This template is specifically designed to work with AI development tools:

### Bolt.new Integration
- **Web App**: Generate React components, pages, and flows directly
- **Apple TV**: Create React Native screens and components  
- **Styling**: Tailwind CSS for rapid UI iteration
- **APIs**: Pre-configured API clients for content and authentication

### Cursor Acceleration  
- **Native Shells**: Scaffold platform-specific build configs and deployment scripts
- **Backend Integration**: Generate API wrappers and data models
- **Platform Optimization**: TV-specific performance and UX enhancements

## 🛠️ Development Workflow

### 1. Frontend Development (Bolt.new)
```bash
# Start your web app
npm run dev

# Use Bolt.new to iterate on:
# - React components and pages
# - Spatial navigation flows  
# - Video player integration
# - Authentication flows
```

### 2. Platform Deployment (Cursor)
```bash
# Use Cursor to help with:
# - Platform-specific build configurations
# - App store submission processes  
# - Performance optimizations
# - Native feature integrations
```

### 3. Testing on Real Devices
- **webOS**: LG Developer Mode TVs
- **Tizen**: Samsung Developer Mode TVs  
- **Android TV**: ADB over network or USB
- **Apple TV**: TestFlight or direct Xcode deployment

## 📦 Key Features

### TV-Optimized UX
- **Spatial Navigation**: D-pad and remote control support
- **Focus Management**: Visual focus indicators and navigation logic
- **Safe Areas**: Proper handling of TV screen overscan
- **Performance**: Optimized for TV hardware constraints

### Content & Playback
- **DRM Support**: Licensed video playback with `@digitalvirgo/drm-player`
- **HLS Streaming**: Adaptive bitrate streaming
- **Content APIs**: Integration with Galaxy content management
- **Offline Support**: Cached metadata and progressive enhancement

### Authentication
- **Device Code Flow**: QR code pairing for keyboardless TVs
- **Session Management**: Persistent auth across app launches  
- **Multi-Device**: Sync with smartphone and web accounts

### Deployment
- **OTA Updates**: Web app updates without app store submissions
- **CDN Distribution**: Global content delivery optimization
- **Analytics**: Usage tracking and performance monitoring

## 🔧 Configuration

### Environment Variables
```bash
# Web App Development
VITE_API_BASE_URL=https://your-api.com
VITE_CDN_BASE_URL=https://your-cdn.com
VITE_AUTH_BASE_URL=https://your-auth.com

# Production
VITE_APP_ENV=production
VITE_ENABLE_ANALYTICS=true
```

### Platform Customization
- **webOS**: Update `appinfo.json` for app metadata
- **Tizen**: Configure `config.xml` for Samsung certification  
- **Android TV**: Modify `build.gradle` for Play Store submission
- **Apple TV**: Update `app.config.js` for App Store Connect

## 📖 Documentation

- **Architecture Overview**: See `docs/architecture-slides.md` for detailed architecture decisions
- **Platform Guides**: Individual README files in each platform directory
- **API Reference**: Generated docs in `docs/api/`
- **Deployment Guides**: Step-by-step platform deployment in `docs/deployment/`

## 🤝 Contributing

This is a template repository designed to be forked and customized. Key areas for contribution:

1. **Platform Support**: Additional TV platforms or streaming devices
2. **AI Integration**: Enhanced Bolt.new/Cursor workflows  
3. **Performance**: TV-specific optimizations and benchmarks
4. **Documentation**: Improved setup guides and troubleshooting

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built on the foundation of the **tv-vod** project
- **DRM Player**: [`@digitalvirgo/drm-player`](https://github.com/matteoburgassi/drm-player) façade for TV playback
- **Spatial Navigation**: [`@noriginmedia/norigin-spatial-navigation`](https://github.com/NoriginMedia/Norigin-Spatial-Navigation)
- **AI Tools**: Optimized for [Bolt.new](https://bolt.new) and [Cursor](https://cursor.sh)

---

**Ready to build the next generation of Smart TV apps? Clone this repo and start with Bolt.new! 🚀**