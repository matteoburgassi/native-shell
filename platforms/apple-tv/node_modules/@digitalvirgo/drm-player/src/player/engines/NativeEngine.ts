import type { PlayerEngine, PlayRequest, PlayerState, StateListener } from '../types';
import { INITIAL_STATE } from '../types';

export class NativeEngine implements PlayerEngine {
  private video: HTMLVideoElement | null = null;
  private state: PlayerState = { ...INITIAL_STATE };
  private listeners = new Set<StateListener>();

  attach(container: HTMLElement): void {
    if (!container) throw new Error('NativeEngine.attach: container is null');

    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    this.video = document.createElement('video');
    this.video.style.position = 'absolute';
    this.video.style.inset = '0';
    this.video.style.width = '100%';
    this.video.style.height = '100%';
    this.video.style.objectFit = 'contain';
    this.video.playsInline = true;
    container.appendChild(this.video);
    this.bindEvents();
  }

  async load(request: PlayRequest): Promise<void> {
    if (!this.video) throw new Error('Engine not attached');

    this.updateState({ loading: true, error: null, ended: false });

    this.video.src = request.url;
    if (request.poster) this.video.poster = request.poster;
    this.video.muted = request.muted ?? false;
    this.video.loop = request.loop ?? false;

    if (request.autoplay !== false) {
      try {
        await this.video.play();
      } catch {
        this.updateState({ playing: false, paused: true });
      }
    }
  }

  play(): void {
    this.video?.play();
  }

  pause(): void {
    this.video?.pause();
  }

  seek(seconds: number): void {
    if (this.video) {
      this.video.currentTime = Math.max(0, Math.min(this.video.duration || 0, seconds));
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
    if (this.video) {
      this.video.pause();
      this.video.removeAttribute('src');
      this.video.load();
      this.video.remove();
      this.video = null;
    }
    this.listeners.clear();
    this.state = { ...INITIAL_STATE };
  }

  private bindEvents(): void {
    const v = this.video;
    if (!v) return;

    v.addEventListener('playing', () => this.updateState({ playing: true, paused: false, loading: false }));
    v.addEventListener('pause', () => this.updateState({ playing: false, paused: true }));
    v.addEventListener('waiting', () => this.updateState({ loading: true }));
    v.addEventListener('canplay', () => this.updateState({ loading: false }));
    v.addEventListener('ended', () => this.updateState({ playing: false, paused: false, ended: true }));
    v.addEventListener('error', () => {
      const msg = v.error?.message || 'Playback error';
      this.updateState({ error: msg, loading: false, playing: false });
    });
    v.addEventListener('loadedmetadata', () => this.updateState({ duration: v.duration }));
    v.addEventListener('timeupdate', () => this.updateState({ currentTime: v.currentTime }));
  }

  private updateState(partial: Partial<PlayerState>): void {
    this.state = { ...this.state, ...partial };
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}
