import type { ModuleFederationConfig } from "@nx/module-federation";

const sharedLibs = [
  '@base-hub/ui',
  '@base-hub/domain',
];

const config: ModuleFederationConfig = {
  name: 'order',

  exposes: {
    './Module': './src/app/app.tsx',
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

export default config;