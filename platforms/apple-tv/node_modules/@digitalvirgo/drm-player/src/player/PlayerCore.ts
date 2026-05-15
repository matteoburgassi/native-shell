import type { PlayerEngine, PlayRequest, PlayerState, StateListener } from './types';
import { INITIAL_STATE } from './types';
import { NativeEngine } from './engines/NativeEngine';

export class PlayerCore {
  private engine: PlayerEngine | null = null;
  private container: HTMLElement | null = null;
  private stateListeners = new Set<StateListener>();
  private engineUnsub: (() => void) | null = null;

  attach(container: HTMLElement): void {
    this.container = container;
  }

  isAttached(): boolean {
    return this.container !== null;
  }

  async load(request: PlayRequest): Promise<void> {
    const container = this.container;
    if (!container) throw new Error('PlayerCore not attached to a container');

    this.destroyEngine();

    if (request.drm) {
      const { DrmEngine } = await import('./engines/DrmEngine');
      if (!this.container) return;
      this.engine = new DrmEngine();
    } else {
      this.engine = new NativeEngine();
    }

    this.engine.attach(container);
    this.engineUnsub = this.engine.onStateChange((state) => {
      for (const listener of this.stateListeners) {
        listener(state);
      }
    });

    await this.engine.load(request);
  }

  play(): void {
    this.engine?.play();
  }

  pause(): void {
    this.engine?.pause();
  }

  seek(seconds: number): void {
    this.engine?.seek(seconds);
  }

  getState(): PlayerState {
    return this.engine?.getState() ?? { ...INITIAL_STATE };
  }

  onStateChange(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  destroy(): void {
    this.destroyEngine();
    this.stateListeners.clear();
    this.container = null;
  }

  private destroyEngine(): void {
    if (this.engineUnsub) {
      this.engineUnsub();
      this.engineUnsub = null;
    }
    if (this.engine) {
      this.engine.destroy();
      this.engine = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
