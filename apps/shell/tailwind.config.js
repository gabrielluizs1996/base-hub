const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

const preset = require('../../libs/shared/tailwind-config/src/index');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
    '../../libs/**/*.{ts,tsx,html}',
  '../../apps/**/*.{ts,tsx,html}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
