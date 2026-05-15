export interface DrmConfig {
  merchant: string;
  userId: string;
  sessionId: string;
  assetId: string;
  authToken?: string;
}

export interface PlayRequest {
  url: string;
  poster?: string;
  drm?: DrmConfig;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export interface PlayerState {
  playing: boolean;
  paused: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  error: string | null;
  ended: boolean;
}

export const INITIAL_STATE: PlayerState = {
  playing: false,
  paused: false,
  currentTime: 0,
  duration: 0,
  loading: false,
  error: null,
  ended: false,
};

export type StateListener = (state: PlayerState) => void;

export interface PlayerEngine {
  attach(container: HTMLElement): void;
  load(request: PlayRequest): Promise<void>;
  play(): void;
  pause(): void;
  seek(seconds: number): void;
  getState(): PlayerState;
  onStateChange(listener: StateListener): () => void;
  destroy(): void;
}
