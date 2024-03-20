const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
    ),
    join(
      __dirname,
      '{src,pages,components,view,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'nextui', // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: 'dark', // default theme from the themes object
      defaultExtendTheme: 'dark', // default theme to extend on custom themes
    }),
  ],
};
