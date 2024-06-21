import _ from 'lodash';

export const colorsRaw = {
  primitives: {
    blue600: 'var(--blue600)',
    blue700: 'var(--blue700)',
    grey900: 'var(--grey900)',
    grey800: 'var(--grey800)',
    grey700: 'var(--grey700)',
    grey600: 'var(--grey600)',
    grey500: 'var(--grey500)',
    grey400: 'var(--grey400)',
    grey300: 'var(--grey300)',
    grey200: 'var(--grey200)',
    grey100: 'var(--grey100)',
    red200: 'var(--red200)',
  },
  border: {
    primary: 'var(--color-border-primary)',
    secondary: 'var(--color-border-secondary)',
    inverted: 'var(--color-border-inverted)',
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    tertiary: 'var(--color-text-tertiary)',
    link: 'var(--color-text-link)',
    inverted: 'var(--color-text-inverted)',
  },
  background: {
    primary: 'var(--color-background-primary)',
    secondary: 'var(--color-background-secondary)',
    'primary-inverted': 'var(--color-background-primary-inverted)',
    'secondary-inverted': 'var(--color-background-secondary-inverted)',
    highlighted: 'var(--color-background-highlighted)',
  },
} satisfies Record<string, Record<string, `var(--${string})`>>;

export const colors = _.mapValues(colorsRaw, (colorGroup) =>
  _.mapValues(colorGroup, (color) => `rgb(${color})`),
) as typeof colorsRaw;
