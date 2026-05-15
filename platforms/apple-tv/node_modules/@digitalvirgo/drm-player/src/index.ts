export { configure } from './config';
export type { DrmPlayerConfig } from './config';

export { usePlayer } from './player';
export type { DrmConfig, PlayRequest, PlayerState } from './player/types';

export { getSmartVideoDrmConfig } from './services/smartvideo';
export { deliveryOrder, dvHash, loginWithEmail, fetchAccountInfo } from './services/auth';
export type { SmartVideoConfig, User } from './services/types';

export const PLAYER_CONTAINER_CLASS = 'player-container';
