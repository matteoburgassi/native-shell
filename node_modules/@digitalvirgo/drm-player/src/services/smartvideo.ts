import md5 from 'blueimp-md5';
import { getConfig } from '../config';
import type { SmartVideoConfig } from './types';

function secureParam(pub: number): string {
  return md5(`${pub}drmPrivateKey4androidclient`);
}

export async function getSmartVideoDrmConfig(params: {
  userId: string;
  galaxyRef: number;
  tokenUrl: string;
  orderId: string;
  isKlientoUser?: boolean;
  country?: string;
}): Promise<SmartVideoConfig> {
  const cfg = getConfig();
  const pub = Date.now();

  const searchParams = new URLSearchParams({
    is_download: '0',
    method: 'getvideodrmmobile',
    user: 'clientdrmandroid',
    kliento: params.isKlientoUser !== false ? '1' : '0',
    user_id: params.userId,
    pub: String(pub),
    website: 'www.playvod.fr',
    idm: '9004',
    secure: secureParam(pub),
    galaxy_ref: String(params.galaxyRef),
    token_url: params.tokenUrl,
    order_id: params.orderId,
  });

  if (params.country) {
    searchParams.set('cty', params.country);
  }

  const res = await fetch(`${cfg.smartVideoHost}/delivery?${searchParams}`);

  if (!res.ok) {
    throw new Error(`SmartVideo API error (${res.status})`);
  }

  const json = await res.json();

  if (!json.stream) {
    throw new Error('SmartVideo returned no stream URL');
  }

  return {
    stream: json.stream,
    sessionId: json.sessionId,
    drm: json.drm,
    assets: json.assets,
    drm_end: json.drm_end,
    drm_view: json.drm_view,
  };
}
