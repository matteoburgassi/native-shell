export interface User {
  id: string;
  email?: string;
  msisdn?: string;
  firstname?: string;
  lastname?: string;
  subscribed: boolean;
  token?: string;
}

export interface SmartVideoConfig {
  stream: string;
  sessionId: string;
  drm: { stream: string; dwn_high: string; dwn_low: string };
  assets: { stream: string; dwn_high: string; dwn_low: string };
  drm_end: string;
  drm_view: number;
}
