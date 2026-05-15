export interface DrmPlayerConfig {
  serviceId: string;

  authLogin?: string;
  authSecret?: string;
  authHost?: string;

  smartVideoHost?: string;

  drmEnv?: string;
  castlabsLicense?: string;
}

const DEFAULTS: Omit<Required<DrmPlayerConfig>, 'serviceId' | 'castlabsLicense'> = {
  authLogin: 'PlayVodMax_Ios',
  authSecret: '912ai6xn',
  authHost: '/api/user',
  smartVideoHost: '/api/smartvideo',
  drmEnv: 'DRMtoday',
};

let _config: DrmPlayerConfig | null = null;

export function configure(config: DrmPlayerConfig): void {
  _config = config;
}

export function getConfig(): Required<Omit<DrmPlayerConfig, 'castlabsLicense'>> & { castlabsLicense?: string } {
  if (!_config) {
    throw new Error(
      '[@digitalvirgo/drm-player] Not configured. Call configure({ serviceId: "..." }) before using the library.',
    );
  }

  return {
    serviceId: _config.serviceId,
    authLogin: _config.authLogin ?? DEFAULTS.authLogin,
    authSecret: _config.authSecret ?? DEFAULTS.authSecret,
    authHost: _config.authHost ?? DEFAULTS.authHost,
    smartVideoHost: _config.smartVideoHost ?? DEFAULTS.smartVideoHost,
    drmEnv: _config.drmEnv ?? DEFAULTS.drmEnv,
    castlabsLicense: _config.castlabsLicense,
  };
}
