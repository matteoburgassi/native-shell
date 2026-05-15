# DRM Player Integration — Bolt.new Prompt

This prompt adds DRM-protected video playback to the existing TV VOD app. The player SDK and DRM services are provided by the `@digitalvirgo/drm-player` npm package — you only need to wire the UI and API calls.

---

## Package Installation

Add to `package.json` dependencies:

```json
"@digitalvirgo/drm-player": "github:matteoburgassi/drm-player"
```

Then `npm install`.

---

## Configuration

Call `configure()` once at app startup (e.g. in `src/main.tsx`), **before** rendering:

```ts
import { configure } from '@digitalvirgo/drm-player';
import '@digitalvirgo/drm-player/styles.css';
import { SERVICE_ID } from './constants/api';

configure({
  serviceId: SERVICE_ID,
  castlabsLicense: import.meta.env.VITE_CASTLABS_LICENSE || undefined,
  drmEnv: import.meta.env.VITE_DRM_ENV || undefined,
});
```

The `styles.css` import provides the `.player-container` CSS rules needed for proper video scaling.

---

## Player Hook API

Import from `@digitalvirgo/drm-player`:

```ts
import { usePlayer, PLAYER_CONTAINER_CLASS } from '@digitalvirgo/drm-player';
import type { DrmConfig, PlayRequest, PlayerState } from '@digitalvirgo/drm-player';
```

### usePlayer()

```ts
const { containerRef, state, play, pause, resume, seek, destroy } = usePlayer();
```

| Return | Type | Description |
|--------|------|-------------|
| `containerRef` | `RefCallback<HTMLDivElement>` | Attach to a `<div>` — the player renders inside it |
| `state` | `PlayerState` | Reactive playback state |
| `play(request)` | `(PlayRequest) => Promise<void>` | Load and play content |
| `pause()` | `() => void` | Pause |
| `resume()` | `() => void` | Resume |
| `seek(seconds)` | `(number) => void` | Seek to absolute time |
| `destroy()` | `() => void` | Clean up |

### Types

```ts
interface PlayRequest {
  url: string;
  poster?: string;
  drm?: DrmConfig;    // omit for non-DRM content
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

interface DrmConfig {
  merchant: string;    // always "digitalvirgo"
  userId: string;      // logged-in user's ID
  sessionId: string;   // from SmartVideo API
  assetId: string;     // from SmartVideo API (assets.stream)
  authToken?: string;  // from SmartVideo API (drm.stream)
}

interface PlayerState {
  playing: boolean;
  paused: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  error: string | null;
  ended: boolean;
}
```

---

## VideoPlayer Component

The `VideoPlayer` component renders a full-screen overlay with the player and controls.

```tsx
import { usePlayer, PLAYER_CONTAINER_CLASS } from '@digitalvirgo/drm-player';

// In the component:
<div className="fixed inset-0 z-50 bg-black">
  <div ref={containerRef} className={`${PLAYER_CONTAINER_CLASS} h-full w-full`} />
  {/* Controls overlay on top */}
</div>
```

Key behaviors:
- Call `play({ url, poster, drm, autoplay: true })` on mount
- Use `state.playing`, `state.currentTime`, `state.duration`, `state.loading`, `state.error` for UI
- `state.ended` triggers close
- Show loading spinner when `state.loading`
- Show error overlay when `state.error`

Props:

```ts
interface VideoPlayerProps {
  url: string;
  poster?: string;
  drm?: DrmConfig;
  onClose: () => void;
}
```

---

## DRM Playback Flow

When the user presses Play on a content detail page, determine if the content is DRM-protected and follow the appropriate path.

### Detecting DRM content

```ts
import { getMainDeliveryDrm } from '../utils/assets';

const isDrm = content ? getMainDeliveryDrm(content.deliveries) : false;
```

A delivery is DRM if `mainDelivery.type` contains "drm" or `mainDelivery.drm === true`.

### Non-DRM path

Simply pass the stream URL to the player:

```ts
play({ url: streamUrl, autoplay: true });
```

### DRM path (requires logged-in user)

Three API calls in sequence, using functions from the package:

#### Step 1 — Get delivery order

```ts
import { deliveryOrder } from '@digitalvirgo/drm-player';

const order = await deliveryOrder(user.id, Number(contentId));
// order.orderId is the "do_id" from the API
```

Endpoint: `GET /delivery/order` on User API (`userv1.dv-content.io`).

#### Step 2 — Get DRM config from SmartVideo API

```ts
import { getSmartVideoDrmConfig } from '@digitalvirgo/drm-player';

const tokenUrl = getMainStreamUrl(content.deliveries) ?? '';

const smartVideo = await getSmartVideoDrmConfig({
  userId: user.id,
  galaxyRef: Number(contentId),
  tokenUrl,
  orderId: order.orderId,
});
```

Endpoint: `GET /delivery` on SmartVideo API (`smartvideo-api.galaxydve.com`).

Returns:
- `smartVideo.stream` — the actual playable stream URL
- `smartVideo.sessionId` — DRM session identifier
- `smartVideo.assets.stream` — asset ID for DRMtoday
- `smartVideo.drm.stream` — auth token for DRMtoday

#### Step 3 — Play with DRM config

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

### Complete handlePlay example

```ts
import { deliveryOrder, getSmartVideoDrmConfig } from '@digitalvirgo/drm-player';
import type { DrmConfig } from '@digitalvirgo/drm-player';

const handlePlay = useCallback(async () => {
  if (!content || !contentId) return;

  // Non-DRM: play directly
  if (!isDrm) {
    const mainUrl = getMainStreamUrl(content.deliveries);
    const trailerUrl = getStreamUrl(content.deliveries);
    setPlayerUrl(mainUrl || trailerUrl);
    setDrmConfig(undefined);
    setShowPlayer(true);
    return;
  }

  // DRM: requires login
  if (!user) {
    setDrmError('Login required for DRM content');
    return;
  }

  setDrmLoading(true);
  setDrmError(null);

  try {
    const order = await deliveryOrder(user.id, Number(contentId));
    if (!order?.orderId) throw new Error('Could not obtain delivery order');

    const tokenUrl = getMainStreamUrl(content.deliveries) ?? '';
    const smartVideo = await getSmartVideoDrmConfig({
      userId: user.id,
      galaxyRef: Number(contentId),
      tokenUrl,
      orderId: order.orderId,
    });

    setPlayerUrl(smartVideo.stream);
    setDrmConfig({
      merchant: 'digitalvirgo',
      userId: user.id,
      sessionId: smartVideo.sessionId,
      assetId: smartVideo.assets.stream,
      authToken: smartVideo.drm.stream,
    });
    setShowPlayer(true);
  } catch (err: any) {
    setDrmError(err.message || 'Failed to load DRM content');
  } finally {
    setDrmLoading(false);
  }
}, [content, contentId, isDrm, user]);
```

---

## Vite Proxy Configuration

The package defaults to `/api/user` and `/api/smartvideo` as API hosts (suitable for dev proxy). Add these to `vite.config.ts`:

```ts
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
```

---

## Services Reference (provided by the package)

All these are imported from `@digitalvirgo/drm-player`:

| Function | Description |
|----------|-------------|
| `loginWithEmail(email, password)` | DVE User API login with dvHash |
| `fetchAccountInfo(userId)` | Get user details |
| `deliveryOrder(userId, contentRef, orderType?)` | Get delivery order (`do_id`) |
| `getSmartVideoDrmConfig(params)` | SmartVideo API — returns stream URL + DRM tokens |

---

## Environment Variables

```
VITE_CASTLABS_LICENSE=           # CastLabs SDK license key (localhost always permitted)
VITE_DRM_ENV=DRMtoday            # "DRMtoday" for production, "DRMtoday_STAGING" for staging
```

Auth credentials are configured via `configure()` (defaults: `PlayVodMax_Ios` / `912ai6xn`). Override with:

```ts
configure({
  serviceId: SERVICE_ID,
  authLogin: 'CustomLogin',
  authSecret: 'CustomSecret',
});
```
