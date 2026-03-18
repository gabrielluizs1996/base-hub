import { ModuleFederationConfig } from '@nx/module-federation';

const sharedLibs = ['@base-hub/ui', '@base-hub/ui-utils', '@base-hub/domain'];

const config: ModuleFederationConfig = {
  name: 'order',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
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

    if (name === 'zustand') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: false,
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

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
