import type { PlayerEngine, PlayRequest, PlayerState, StateListener } from '../types';
import { INITIAL_STATE } from '../types';
import { getConfig } from '../../config';

let installed = false;
let clppModule: any = null;

async function ensureInstalled() {
  if (installed) return;

  try {
    clppModule = await import('@castlabs/prestoplay');
    await import('@castlabs/prestoplay/cl.mse');
    await import('@castlabs/prestoplay/cl.dash');
    await import('@castlabs/prestoplay/cl.hls');
    await import('@castlabs/prestoplay/cl.crypto');
    await import('@castlabs/prestoplay/cl.onboard');

    const { clpp } = clppModule;
    clpp.install(clpp.crypto.CryptoComponent);
    clpp.install(clpp.dash.DashComponent);
    clpp.install(clpp.hls.HlsComponent);
    clpp.install(clpp.onboard.OnboardComponent);

    installed = true;
  } catch (e) {
    console.error('[DrmEngine] Failed to load CastLabs SDK:', e);
    throw new Error('@castlabs/prestoplay is not installed. DRM playback requires the CastLabs SDK.');
  }
}

export class DrmEngine implements PlayerEngine {
  private player: any = null;
  private videoEl: HTMLVideoElement | null = null;
  private state: PlayerState = { ...INITIAL_STATE };
  private listeners = new Set<StateListener>();
  private timeInterval: ReturnType<typeof setInterval> | null = null;

  attach(container: HTMLElement): void {
    if (!container) throw new Error('DrmEngine.attach: container is null');

    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    this.videoEl = document.createElement('video');
    this.videoEl.id = `drm-video-${Date.now()}`;
    this.videoEl.style.position = 'absolute';
    this.videoEl.style.inset = '0';
    this.videoEl.style.width = '100%';
    this.videoEl.style.height = '100%';
    this.videoEl.style.objectFit = 'contain';
    this.videoEl.playsInline = true;
    container.appendChild(this.videoEl);
  }

  async load(request: PlayRequest): Promise<void> {
    if (!this.videoEl) throw new Error('Engine not attached');
    if (!request.drm) throw new Error('DRM config required for DrmEngine');

    this.updateState({ loading: true, error: null, ended: false });

    try {
      await ensureInstalled();

      const { clpp } = clppModule;
      const cfg = getConfig();

      if (this.player) {
        await this.player.release();
      }

      const playerConfig: any = {};
      if (cfg.castlabsLicense) {
        playerConfig.license = cfg.castlabsLicense;
      }

      this.player = new clpp.Player(this.videoEl, playerConfig);
      this.bindPlayerEvents(clpp);

      const sourceType = this.detectSourceType(request.url);

      const config: any = {
        source: {
          url: request.url,
          type: sourceType,
          drmProtected: true,
        },
        autoplay: request.autoplay !== false,
        muted: request.muted ?? false,
        drm: {
          env: cfg.drmEnv,
          customData: {
            merchant: request.drm.merchant,
            userId: request.drm.userId,
            sessionId: request.drm.sessionId,
            assetId: request.drm.assetId,
          },
        },
      };

      if (request.drm.authToken) {
        config.drm.customData.authToken = request.drm.authToken;
      }

      if (request.poster) {
        this.videoEl.poster = request.poster;
      }

      await this.player.load(config);
    } catch (err: any) {
      if (this.isIgnorableError(err)) return;
      const message = this.mapError(err);
      this.updateState({ error: message, loading: false, playing: false });
    }
  }

  play(): void {
    this.player?.play();
  }

  pause(): void {
    this.player?.pause();
  }

  seek(seconds: number): void {
    if (this.player) {
      const duration = this.player.getDuration?.() || 0;
      this.player.seek(Math.max(0, Math.min(duration, seconds)));
    }
  }

  getState(): PlayerState {
    return { ...this.state };
  }

  onStateChange(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  destroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }

    if (this.player) {
      try {
        this.player.destroy();
      } catch {
        // ignore destroy errors
      }
      this.player = null;
    }

    if (this.videoEl) {
      this.videoEl.remove();
      this.videoEl = null;
    }

    this.listeners.clear();
    this.state = { ...INITIAL_STATE };
  }

  private bindPlayerEvents(clpp: any): void {
    if (!this.player) return;

    this.player.on(clpp.events.STATE_CHANGED, (e: any) => {
      const { currentState } = e.detail;
      switch (currentState) {
        case clpp.Player.State.PLAYING:
          this.updateState({ playing: true, paused: false, loading: false });
          break;
        case clpp.Player.State.PAUSED:
          this.updateState({ playing: false, paused: true });
          break;
        case clpp.Player.State.BUFFERING:
          this.updateState({ loading: true });
          break;
        case clpp.Player.State.ENDED:
          this.updateState({ playing: false, paused: false, ended: true });
          break;
        case clpp.Player.State.IDLE:
          this.updateState({ playing: false, paused: false, loading: false });
          break;
        case clpp.Player.State.ERROR:
          this.updateState({ playing: false, loading: false, error: 'Playback error' });
          break;
      }
    });

    this.player.on(clpp.events.ERROR, (e: any) => {
      if (this.isIgnorableError(e.detail)) return;
      const message = this.mapError(e.detail);
      this.updateState({ error: message, loading: false, playing: false });
    });

    this.player.on(clpp.events.LOADEDMETADATA, () => {
      const duration = this.player?.getDuration?.() || 0;
      this.updateState({ duration, loading: false });
    });

    this.timeInterval = setInterval(() => {
      if (this.player && this.state.playing) {
        const currentTime = this.player.getPosition?.() || 0;
        this.updateState({ currentTime });
      }
    }, 250);
  }

  private detectSourceType(url: string): string {
    const lower = url.toLowerCase();
    if (lower.includes('.m3u8')) return 'application/x-mpegURL';
    if (lower.includes('.ism')) return 'application/vnd.ms-sstr+xml';
    return 'application/dash+xml';
  }

  private isIgnorableError(err: any): boolean {
    const msg = String(err?.message ?? err ?? '');
    if (msg.includes('interrupted')) return true;
    if (msg.includes('AbortError')) return true;
    return false;
  }

  private mapError(err: any): string {
    if (!err) return 'Unknown playback error';

    const code = err.code ?? err.category;
    const msg = err.message ?? err.detail ?? String(err);

    if (code === 6001 || msg.includes('LICENSE')) return 'DRM license request failed';
    if (code === 6012 || msg.includes('expired')) return 'DRM license expired';
    if (msg.includes('HDCP') || msg.includes('output')) return 'HDCP/output protection error';
    if (code === 1001) return 'Network error';

    return `Playback error: ${msg}`;
  }

  private updateState(partial: Partial<PlayerState>): void {
    this.state = { ...this.state, ...partial };
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}
