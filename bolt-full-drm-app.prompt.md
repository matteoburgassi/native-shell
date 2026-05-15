# Galaxy TV VOD App — Full Build Prompt for Bolt.new

Build a TV-optimized VOD streaming app with React, targeting smart TVs (LG webOS, Samsung Tizen, Android TV) and browsers. The app uses D-pad/remote spatial navigation, connects to the Galaxy content API, authenticates users via DVE User API, and plays DRM-protected content. The player SDK and DRM services are provided by the `@digitalvirgo/drm-player` npm package.

---

## Tech Stack

- React 19, TypeScript, Vite 7, Tailwind CSS v4
- `@noriginmedia/norigin-spatial-navigation` for D-pad navigation
- `react-router-dom` for routing
- `@digitalvirgo/drm-player` for player facade + DRM services (CastLabs PRESTOplay, SmartVideo, auth)

---

## Project Structure

```
src/
├── main.tsx                    # Entry point (configure drm-player here)
├── App.tsx                     # Router + spatial nav init + auth gate
├── index.css                   # Tailwind + global styles
├── constants/
│   └── api.ts                  # API keys, rubric IDs
├── contexts/
│   └── AuthContext.tsx          # Auth state (user, login, logout)
├── types/
│   ├── api.ts                  # Galaxy API types
│   ├── tizen.d.ts              # Tizen global type
│   └── webos.d.ts              # webOS global type
├── services/
│   └── api.ts                  # Galaxy content API
├── utils/
│   ├── assets.ts               # Image/stream URL extraction
│   ├── keyMap.ts               # TV remote key mapping
│   └── platformInit.ts         # Tizen/webOS key registration
├── components/
│   ├── Header.tsx              # Fixed header (logo, search, user button)
│   ├── Hero.tsx                # Auto-rotating hero carousel
│   ├── ContentCard.tsx         # Focusable content card
│   ├── ContentRow.tsx          # Horizontal row of cards
│   ├── VideoPlayer.tsx         # Full-screen player with controls
│   ├── ExitDialog.tsx          # Exit confirmation modal
│   └── LoadingSpinner.tsx      # Centered loading spinner
└── pages/
    ├── HomePage.tsx            # Hero + category rows
    ├── ContentDetailsPage.tsx  # Details, trailer, play (DRM or native)
    ├── SearchPage.tsx          # Search with results grid
    └── LoginPage.tsx           # Email/password login, guest mode
```

Note: There is NO `src/lib/player/` or `vendor/` directory. The player and DRM services come from the `@digitalvirgo/drm-player` package.

---

## package.json

```json
{
  "name": "galaxy-tv",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "npx vite",
    "build": "npx tsc -b && npx vite build",
    "preview": "npx vite preview"
  },
  "dependencies": {
    "@digitalvirgo/drm-player": "github:matteoburgassi/drm-player",
    "@noriginmedia/norigin-spatial-navigation": "^2.3.0",
    "@tailwindcss/vite": "^4.2.1",
    "@vitejs/plugin-react": "^5.1.1",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.1",
    "tailwindcss": "^4.2.1",
    "typescript": "~5.9.3",
    "vite": "^7.3.1"
  }
}
```

---

## Environment Variables

Create `.env`:

```
VITE_API_BASE_URL=https://galaxy-api.galaxydve.com
VITE_API_KEY=<galaxy_api_key>
VITE_API_SECRET=<galaxy_api_secret>
VITE_CAMPAIGN_ID=4679
VITE_SERVICE_ID=39
VITE_COUNTRY_CODE=fr
VITE_LANGUAGE_CODE=fr

VITE_CASTLABS_LICENSE=
VITE_DRM_ENV=DRMtoday
```

---

## Entry Point (`src/main.tsx`)

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configure } from '@digitalvirgo/drm-player';
import '@digitalvirgo/drm-player/styles.css';
import App from './App';
import { platformInit } from './utils/platformInit';
import { SERVICE_ID } from './constants/api';
import './index.css';

configure({
  serviceId: SERVICE_ID,
  castlabsLicense: import.meta.env.VITE_CASTLABS_LICENSE || undefined,
  drmEnv: import.meta.env.VITE_DRM_ENV || undefined,
});

platformInit();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

---

## Vite Configuration

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/user': {
        target: 'https://userv1.dv-content.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/user/, ''),
        secure: true,
      },
      '/api/smartvideo': {
        target: 'https://smartvideo-api.galaxydve.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/smartvideo/, ''),
        secure: true,
      },
    },
  },
})
```

---

## Global Styles (`src/index.css`)

```css
@import "tailwindcss";

@theme {
  --color-sky-400: #38bdf8;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
*::-webkit-scrollbar {
  display: none;
}

html {
  background-color: #0a0a0a;
  color: white;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior: none;
  overflow: hidden;
  cursor: none;
}
```

The `.player-container` CSS is provided by `@digitalvirgo/drm-player/styles.css` (imported in `main.tsx`).

---

## Types

### Galaxy API (`src/types/api.ts`)

```ts
export interface AssetItem {
  ratio_tech_label: string;
  height: number;
  width: number;
  url: string;
}

export interface ContentAssets {
  cover?: AssetItem[];
  icon?: AssetItem[];
  screenshot?: AssetItem[];
  'art-background'?: AssetItem[];
  highlight?: AssetItem[];
  'highlight-title'?: AssetItem[];
}

export interface DeliveryQuality {
  url: string;
}

export interface ContentDeliveries {
  ba?: Record<string, DeliveryQuality[]>;
  mainDelivery?: {
    url: string;
    type: string;
    drm: boolean;
    duration: number;
    resolution: string;
    audio: string[] | null;
    subtitle: string[] | null;
  };
}

export interface ContentItem {
  title: string;
  description: string;
  content_id: number;
  content_type: string;
  rubric_id: number[];
  assets: ContentAssets;
  deliveries?: ContentDeliveries;
}

export interface RubricItem {
  rubric_id: number;
  rubric_title: string;
  nb_content: number;
}

export interface ApiResponse<T> {
  data: { data: T[] };
}
```

### User type

The `User` type is exported by the package:

```ts
import type { User } from '@digitalvirgo/drm-player';
```

```ts
interface User {
  id: string;
  email?: string;
  msisdn?: string;
  firstname?: string;
  lastname?: string;
  subscribed: boolean;
  token?: string;
}
```

---

## Constants (`src/constants/api.ts`)

```ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;
export const API_SECRET = import.meta.env.VITE_API_SECRET;
export const CAMPAIGN_ID = import.meta.env.VITE_CAMPAIGN_ID;
export const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
export const COUNTRY_CODE = import.meta.env.VITE_COUNTRY_CODE;
export const LANGUAGE_CODE = import.meta.env.VITE_LANGUAGE_CODE;

export const HERO_RUBRIC_ID = '268833';

export const CATEGORY_RUBRIC_IDS = [
  '273536', '268860', '295883', '287837', '294356', '291318',
  '287839', '287838', '287840', '268858', '268859', '268857',
  '270101', '273535', '268866', '273694', '283300', '268844',
  '268850', '268845',
];

export const RELATED_RUBRIC_ID = '270102';
```

---

## Galaxy Content API (`src/services/api.ts`)

All Galaxy endpoints share common params: `api_key`, `api_secret_key`, `country_code`, `language_code`, `campaign_id`.

```ts
function buildParams(extra: Record<string, string> = {}): URLSearchParams {
  return new URLSearchParams({
    api_key: API_KEY,
    api_secret_key: API_SECRET,
    country_code: COUNTRY_CODE,
    language_code: LANGUAGE_CODE,
    campaign_id: CAMPAIGN_ID,
    ...extra,
  });
}
```

| Function | Endpoint | Extra Params |
|----------|----------|--------------|
| `fetchRubricList(rubricId)` | `GET /publishing-rubric-list` | `rubric_id` |
| `fetchContentsByCategory(rubricId)` | `GET /publishing-content-list` | `rubric_id`, `preview=true`, `asset=true`, `delivery=true` |
| `fetchContentDetail(contentId)` | `GET /publishing-content-detail` | `content_id`, `preview=true`, `asset=true`, `delivery=true` |
| `searchContent(query)` | `GET /publishing-content-list` | `content_title`, `content_type=html`, `preview=true`, `asset=true`, `delivery=true`, `without_token=true`, `itemsPerPage=10`, `page=1` |

Response shape: `{ data: { data: T[] } }`

---

## Asset Utilities (`src/utils/assets.ts`)

```ts
getCoverImage(assets)       // Best cover (portrait-3-4 > portrait-2-3 > portrait-9-16 > first)
getArtBackground(assets)    // Widest art-background
getHighlight(assets)        // First highlight image
getHighlightTitle(assets)   // First highlight-title image
getStreamUrl(deliveries)    // Best trailer URL from deliveries.ba (prefer "HD (720p)")
getMainStreamUrl(deliveries) // deliveries.mainDelivery.url
getMainDeliveryDrm(deliveries) // true if mainDelivery.type contains "drm" or drm===true
```

---

## TV Remote Key Mapping (`src/utils/keyMap.ts`)

```ts
export function mapKeyEvent(event: KeyboardEvent): string | null
```

Returns: `'back'`, `'enter'`, `'up'`, `'down'`, `'left'`, `'right'`, `'play_pause'`, `'rewind'`, `'fast_forward'`, `'stop'`, or `null`.

Supports standard keyboard keys plus LG webOS and Samsung Tizen remote keycodes:
- Escape/Backspace/461/10009 -> `back`
- Enter -> `enter`
- Arrows -> `up`/`down`/`left`/`right`
- Space/MediaPlayPause/10252 -> `play_pause`
- MediaRewind/412/10232 -> `rewind`
- MediaFastForward/417/10233 -> `fast_forward`
- MediaStop/413/10253 -> `stop`

---

## Platform Init (`src/utils/platformInit.ts`)

Register Tizen media keys on app start:

```ts
export function platformInit() {
  if (window.tizen?.tvinputdevice) {
    const keys = ['MediaPlayPause', 'MediaRewind', 'MediaFastForward', 'MediaStop'];
    keys.forEach(k => window.tizen.tvinputdevice.registerKey(k));
  }
}
```

---

## Spatial Navigation

Initialize in `App.tsx`:

```ts
import { init } from '@noriginmedia/norigin-spatial-navigation';
init({ debug: false, visualDebug: false, useGetBoundingClientRect: true });
```

### Pattern

Every focusable element uses:

```tsx
const { ref, focused, focusSelf } = useFocusable({
  focusKey: 'unique-key',
  onEnterPress: () => { /* action */ },
  onArrowPress: (direction) => {
    if (direction === 'down') { setFocus('next-key'); return false; }
    return true; // let default behavior handle it
  },
});
```

Wrap focusable regions with `FocusContext.Provider`:

```tsx
<FocusContext.Provider value={focusKey}>
  {children}
</FocusContext.Provider>
```

Use `setFocus('key')` for programmatic focus transitions.

Ensure `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` is called when elements receive focus to handle off-screen elements.

### Focus key conventions

- `header` — app header
- `hero` — hero carousel
- `content-row-{index}` — category rows
- `login-email`, `login-password`, `login-submit`, `login-skip` — login page
- `video-player`, `player-back`, `player-progress`, `player-playpause` — player controls
- `exit-dialog`, `exit-yes`, `exit-no` — exit confirmation

### Focus chaining

Header down -> Hero; Hero down -> first content row; Content rows chain to each other. Player controls: back -> progress -> play/pause (vertical), left/right for seeking.

---

## Authentication

### Auth Context (`src/contexts/AuthContext.tsx`)

```tsx
import type { User } from '@digitalvirgo/drm-player';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
```

Persists user to `localStorage` key `tv_vod_user`. Wrap app in `<AuthProvider>`.

### Login

Use `loginWithEmail` from the package:

```ts
import { loginWithEmail } from '@digitalvirgo/drm-player';

const user = await loginWithEmail(email, password);
```

The package handles password hashing (dvHash), DVE User API calls, and account info fetching internally. It uses the `serviceId`, `authLogin`, `authSecret`, and `authHost` from `configure()`.

### Login Page (`src/pages/LoginPage.tsx`)

TV-friendly login with focusable inputs:
- Email input (focusKey: `login-email`)
- Password input (focusKey: `login-password`)
- Login button (focusKey: `login-submit`)
- "Continue as Guest" button (focusKey: `login-skip`) — logs in as `{ id: 'guest', subscribed: false }`

Show when `!isAuthenticated` (gate in `App.tsx`, not a route).

---

## Player SDK (from `@digitalvirgo/drm-player`)

### Public API

```ts
import { usePlayer, PLAYER_CONTAINER_CLASS } from '@digitalvirgo/drm-player';
import type { DrmConfig, PlayRequest, PlayerState } from '@digitalvirgo/drm-player';

const { containerRef, state, play, pause, resume, seek } = usePlayer();
```

### Usage in VideoPlayer

```tsx
<div ref={containerRef} className={`${PLAYER_CONTAINER_CLASS} h-full w-full`} />
```

### Non-DRM playback

```ts
play({ url: streamUrl, poster: bgImage, autoplay: true });
```

### DRM playback

```ts
play({
  url: smartVideo.stream,
  autoplay: true,
  drm: {
    merchant: 'digitalvirgo',
    userId: user.id,
    sessionId: smartVideo.sessionId,
    assetId: smartVideo.assets.stream,
    authToken: smartVideo.drm.stream,
  },
});
```

---

## DRM Playback Flow (ContentDetailsPage)

When the Play button is pressed:

1. Check `getMainDeliveryDrm(content.deliveries)` — if false, play directly with `getMainStreamUrl()` or `getStreamUrl()` (trailer fallback)
2. If DRM and no logged-in user, show "Login required" message
3. If DRM and logged in:

```ts
import { deliveryOrder, getSmartVideoDrmConfig } from '@digitalvirgo/drm-player';
import type { DrmConfig } from '@digitalvirgo/drm-player';

// a. Get delivery order
const order = await deliveryOrder(user.id, Number(contentId));

// b. Get DRM config from SmartVideo API
const tokenUrl = getMainStreamUrl(content.deliveries) ?? '';
const smartVideo = await getSmartVideoDrmConfig({
  userId: user.id,
  galaxyRef: Number(contentId),
  tokenUrl,
  orderId: order.orderId,
});

// c. Play with DRM config
setPlayerUrl(smartVideo.stream);
setDrmConfig({
  merchant: 'digitalvirgo',
  userId: user.id,
  sessionId: smartVideo.sessionId,
  assetId: smartVideo.assets.stream,
  authToken: smartVideo.drm.stream,
});
setShowPlayer(true);
```

Show loading state during DRM setup, error state on failure.

---

## Pages

### HomePage

- Fixed **Header** at top (logo, search input, user button)
- **Hero** carousel: fetch `HERO_RUBRIC_ID` content, rotate every 8s, show art-background + highlight + highlight-title, Watch/More Info buttons
- **Category rows**: for each ID in `CATEGORY_RUBRIC_IDS`, fetch rubric title + content list, render as `ContentRow` with horizontal-scrolling `ContentCard` items
- Back key at top level shows `ExitDialog`

### ContentDetailsPage (`/content/:contentId`)

- Full-width hero area with trailer auto-playing (muted, looped) or art-background fallback
- Gradient overlays (bottom-to-top, left-to-right)
- Content title, type badge, description
- Play button (triggers DRM flow above) + Back button
- Related content rows (fetch `RELATED_RUBRIC_ID`)
- If DRM and not logged in, show warning text

### SearchPage (`/search`)

- Text input with spatial navigation focus
- Call `searchContent(query)` on input change (debounced)
- Grid of `ContentCard` results

### LoginPage

- Centered card with email/password inputs
- Login button calls `loginWithEmail` (from the package), stores user via `useAuth().login()`
- "Continue as Guest" skips login
- Loading spinner during API call, error message on failure
- All inputs and buttons are focusable with D-pad

---

## Routing (`src/App.tsx`)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { init } from '@noriginmedia/norigin-spatial-navigation';

init({ debug: false, visualDebug: false, useGetBoundingClientRect: true });

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <LoginPage />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/content/:contentId" element={<ContentDetailsPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// Wrap in AuthProvider in main.tsx
```

---

## Styling Guidelines

- Dark theme: background `#0a0a0a`, text white
- Focused elements: `ring-3 ring-white scale-105 shadow-lg shadow-white/20` transition
- Gradients on hero: `bg-gradient-to-t from-[#0a0a0a]`, `bg-gradient-to-r from-[#0a0a0a]/80`
- Cards: rounded corners, subtle hover/focus effects
- All scrollbars hidden, cursor hidden (TV mode)
- Font: Inter (import from Google Fonts or use system fallback)

---

## Key Implementation Notes

1. Every interactive element must use `useFocusable` — TV remotes have no mouse
2. Always call `scrollIntoView` on focus for off-screen elements
3. Use `onArrowPress` to chain focus between sections (header -> hero -> rows)
4. `mapKeyEvent` handles both keyboard and TV remote keys — use it for all key listeners
5. The player SDK handles all CastLabs complexity — just call `play()` with the right config
6. All external API calls need Vite proxy in dev to avoid CORS
7. Use `npx` prefix for scripts in `package.json` (for Bolt.new WebContainer compatibility)
8. Import `User`, `loginWithEmail`, `deliveryOrder`, `getSmartVideoDrmConfig`, `usePlayer`, `PLAYER_CONTAINER_CLASS`, and DRM types from `@digitalvirgo/drm-player` — **not** from local files
9. Call `configure()` in `main.tsx` **before** rendering the app
10. Import `@digitalvirgo/drm-player/styles.css` in `main.tsx` for player container styles
