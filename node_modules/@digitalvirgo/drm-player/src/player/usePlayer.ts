import { useRef, useCallback, useState, useEffect } from 'react';
import { PlayerCore } from './PlayerCore';
import type { PlayRequest, PlayerState } from './types';
import { INITIAL_STATE } from './types';

export function usePlayer() {
  const coreRef = useRef<PlayerCore | null>(null);
  const containerNodeRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<PlayerState>({ ...INITIAL_STATE });

  useEffect(() => {
    const core = new PlayerCore();
    coreRef.current = core;
    const unsub = core.onStateChange(setState);

    if (containerNodeRef.current) {
      core.attach(containerNodeRef.current);
    }

    return () => {
      unsub();
      core.destroy();
      coreRef.current = null;
    };
  }, []);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    containerNodeRef.current = node;
    if (node && coreRef.current && !coreRef.current.isAttached()) {
      coreRef.current.attach(node);
    }
  }, []);

  const play = useCallback(async (request: PlayRequest) => {
    const core = coreRef.current;
    if (!core) return;

    if (!core.isAttached() && containerNodeRef.current) {
      core.attach(containerNodeRef.current);
    }
    if (!core.isAttached()) return;

    await core.load(request);
  }, []);

  const pause = useCallback(() => {
    coreRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    coreRef.current?.play();
  }, []);

  const seek = useCallback((seconds: number) => {
    coreRef.current?.seek(seconds);
  }, []);

  const destroy = useCallback(() => {
    coreRef.current?.destroy();
  }, []);

  return {
    containerRef,
    state,
    play,
    pause,
    resume,
    seek,
    destroy,
  };
}
