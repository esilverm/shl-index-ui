import _ from 'lodash';
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import type { PluginAPI } from 'tailwindcss/types/config';

import { colorsRaw } from './utils/theme/colors';
import { ThemeVariables, lightTheme, darkTheme } from './utils/theme/themeDefs';

const toRGB = (hex: string) => {
  const hexNum = parseInt(hex.replace('#', ''), 16);
  const r = (hexNum >> 16) & 255;
  const g = (hexNum >> 8) & 255;
  const b = hexNum & 255;
  return `${r} ${g} ${b}`;
};

const themeToRGB = (theme: ThemeVariables) =>
  Object.fromEntries(
    Object.entries(theme).map(([key, value]) => [key, toRGB(value)]),
  );

export const themeDefsPlugin = ({ addUtilities, e }: PluginAPI) => {
  addUtilities([
    {
      [`.${e('index-theme-light')}`]: themeToRGB(lightTheme),
      [`.${e('index-theme-dark')}`]: themeToRGB(darkTheme),
    },
  ]);
};

const colorPalette = <Key extends keyof typeof colorsRaw>(key: Key) =>
  _.mapValues(colorsRaw[key], (value) => {
    return `rgba(${value} / <alpha-value>)`;
  }) as (typeof colorsRaw)[Key];

export default {
  content: ['./pages/**/*.tsx', './components/**/*.tsx'],
  theme: {
    colors: {
      ...colorPalette('primitives'),
    },
    fontFamily: {
      raleway: ['var(--font-raleway)', ...fontFamily.sans],
      mont: ['var(--font-montserrat)', ...fontFamily.sans],
    },
    extend: {
      backgroundColor: {
        ...colorPalette('background'),
      },
      borderColor: {
        ...colorPalette('border'),
      },
      textColor: {
        ...colorPalette('text'),
      },
    },
  },
  plugins: [themeDefsPlugin],
} satisfies Config;
