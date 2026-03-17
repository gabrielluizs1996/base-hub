import { ModuleFederationConfig } from '@nx/module-federation';

const sharedLibs = [
  '@base-hub/ui',
  '@base-hub/ui-utils',
];

const config: ModuleFederationConfig = {
  name: 'shell',

  remotes: [
    'order',
  ],

  shared: (name, defaultConfig) => {
    if (name === 'react' || name === 'react-dom') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: false,
        requiredVersion: false,
        eager: true,
      };
    }

    if (sharedLibs.includes(name)) {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: false,
        requiredVersion: false,
      };
    }

    return {
      ...defaultConfig,
      singleton: false,
      strictVersion: false,
    };
  },
};

export default config;