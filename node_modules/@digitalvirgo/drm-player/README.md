# @digitalvirgo/drm-player

DRM video player for Digital Virgo services. Wraps CastLabs PRESTOplay with a simple React hook and includes the SmartVideo API integration for DRM token acquisition.

## Installation

```bash
npm install @digitalvirgo/drm-player
```

Or from a git URL:

```bash
npm install git+ssh://git@github.com:matteoburgassi/drm-player.git
```

## Quick Start

### 1. Configure

Call `configure()` once at app startup (e.g. in `main.tsx`):

```tsx
import { configure } from '@digitalvirgo/drm-player';

configure({
  serviceId: '39',
  castlabsLicense: 'your-castlabs-license-key',
  // In production, set the real hosts:
  // authHost: 'https://userv1.dv-content.io',
  // smartVideoHost: 'https://smartvideo-api.galaxydve.com',
});
```

### 2. Import styles

```tsx
import '@digitalvirgo/drm-player/styles.css';
```

### 3. Use the player

```tsx
import { usePlayer, PLAYER_CONTAINER_CLASS } from '@digitalvirgo/drm-player';

function VideoPlayer({ url }: { url: string }) {
  const { containerRef, state, play, pause, resume, seek } = usePlayer();

  useEffect(() => {
    play({ url, autoplay: true });
  }, [url, play]);

  return (
    <div className="fixed inset-0 bg-black">
      <div ref={containerRef} className={`${PLAYER_CONTAINER_CLASS} h-full w-full`} />
      {state.loading && <Spinner />}
      {state.error && <ErrorOverlay message={state.error} />}
    </div>
  );
}
```

### 4. Play DRM content

For DRM-protected content, use the included DV services:

```tsx
import {
  usePlayer,
  deliveryOrder,
  getSmartVideoDrmConfig,
} from '@digitalvirgo/drm-player';

async function handlePlayDrm(userId: string, contentId: number, tokenUrl: string) {
  // Step 1: Get delivery order
  const order = await deliveryOrder(userId, contentId);
  if (!order) throw new Error('No delivery order');

  // Step 2: Get DRM config from SmartVideo API
  const smartVideo = await getSmartVideoDrmConfig({
    userId,
    galaxyRef: contentId,
    tokenUrl,
    orderId: order.orderId,
  });

  // Step 3: Play with DRM
  play({
    url: smartVideo.stream,
    autoplay: true,
    drm: {
      merchant: 'digitalvirgo',
      userId,
      sessionId: smartVideo.sessionId,
      assetId: smartVideo.assets.stream,
      authToken: smartVideo.drm.stream,
    },
  });
}
```

## API Reference

### `configure(config)`

Initialize the library. Must be called before using any other function.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serviceId` | `string` | *required* | DVE service ID |
| `authLogin` | `string` | `'PlayVodMax_Ios'` | Basic auth username |
| `authSecret` | `string` | `'912ai6xn'` | Basic auth password |
| `authHost` | `string` | `'/api/user'` | DVE User API base URL |
| `smartVideoHost` | `string` | `'/api/smartvideo'` | SmartVideo API base URL |
| `drmEnv` | `string` | `'DRMtoday'` | CastLabs DRMtoday environment |
| `castlabsLicense` | `string` | — | CastLabs SDK license key |

### `usePlayer()`

React hook that manages a player instance.

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `containerRef` | `RefCallback<HTMLDivElement>` | Attach to a container `<div>` |
| `state` | `PlayerState` | Reactive playback state |
| `play(request)` | `(PlayRequest) => Promise<void>` | Load and play |
| `pause()` | `() => void` | Pause playback |
| `resume()` | `() => void` | Resume playback |
| `seek(seconds)` | `(number) => void` | Seek to time |
| `destroy()` | `() => void` | Clean up resources |

### Types

```ts
interface PlayRequest {
  url: string;
  poster?: string;
  drm?: DrmConfig;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

interface DrmConfig {
  merchant: string;
  userId: string;
  sessionId: string;
  assetId: string;
  authToken?: string;
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

### DV Services

```ts
loginWithEmail(email: string, password: string): Promise<User>
fetchAccountInfo(userId: string): Promise<Partial<User>>
deliveryOrder(userId: string, contentRef: number, orderType?: number): Promise<{ orderId: string } | null>
dvHash(password: string): Promise<string>
getSmartVideoDrmConfig(params: { userId, galaxyRef, tokenUrl, orderId, isKlientoUser?, country? }): Promise<SmartVideoConfig>
```

## Dev Proxy Setup

In development, the default hosts (`/api/user`, `/api/smartvideo`) expect a proxy to avoid CORS. Example Vite config:

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

## License

Private. CastLabs PRESTOplay SDK requires a valid license from [castlabs.com](https://account.castlabs.com).
