import { colorsRaw } from './colors';

type GetValues<Obj extends Record<string, unknown>> = Obj[keyof Obj];
export type ThemeVariables = Record<
  GetValues<{
    [Key1 in keyof typeof colorsRaw]: GetValues<{
      [Key2 in keyof (typeof colorsRaw)[Key1]]: (typeof colorsRaw)[Key1][Key2] extends `var(${infer Variable})`
        ? Variable
        : never;
    }>;
  }>,
  `#${string}`
>;

export const lightTheme: ThemeVariables = {
  // Primitives
  '--blue600': '#1A73E8',
  '--blue700': '#1976D2',
  '--grey900': '#212529',
  '--grey800': '#343A40',
  '--grey700': '#495057',
  '--grey600': '#6C757D',
  '--grey500': '#ADB5BD',
  '--grey400': '#CED4DA',
  '--grey300': '#DEE2E6',
  '--grey200': '#E9ECEF',
  '--grey100': '#F8F9FA',
  '--red200': '#EF9A9A',

  // Border
  '--color-border-primary': '#212529',
  '--color-border-secondary': '#ADB5BD',
  '--color-border-inverted': '#F8F9FA',
  '--color-border-table': '#ADB5BD',

  // Text
  '--color-text-primary': '#212529',
  '--color-text-secondary': '#343A40',
  '--color-text-tertiary': '#6C757D',
  '--color-text-inverted': '#F8F9FA',
  '--color-text-link': '#1A73E8',
  '--color-text-table-row': '#212529',
  '--color-text-table-header': '#F8F9FA',
  '--color-text-boxscore-header': '#6C757D',

  // Background
  '--color-background-primary': '#F8F9FA',
  '--color-background-secondary': '#E9ECEF',
  '--color-background-primary-inverted': '#212529',
  '--color-background-secondary-inverted': '#343A40',
  '--color-background-highlighted': '#1976D2',
  '--color-background-table-row': '#F8F9FA',
  '--color-background-table-header': '#212529',
  '--color-background-site-header': '#212529',
  '--color-background-boxscore-header': '#E9ECEF',
  '--color-background-scorebar-date': '#E9ECEF',
};

export const darkTheme: ThemeVariables = {
  // Primitives
  '--blue600': '#1A73E8',
  '--blue700': '#1976D2',
  '--grey900': '#212529',
  '--grey800': '#343A40',
  '--grey700': '#495057',
  '--grey600': '#6C757D',
  '--grey500': '#ADB5BD',
  '--grey400': '#CED4DA',
  '--grey300': '#DEE2E6',
  '--grey200': '#E9ECEF',
  '--grey100': '#F8F9FA',
  '--red200': '#EF9A9A',

  // Border
  '--color-border-primary': '#F8F9FA',
  '--color-border-secondary': '#ADB5BD',
  '--color-border-inverted': '#212529',
  '--color-border-table': '#4E565E',

  // Text
  '--color-text-primary': '#F8F9FA',
  '--color-text-secondary': '#E9ECEF',
  '--color-text-tertiary': '#CED4DA',
  '--color-text-inverted': '#212529',
  '--color-text-link': '#529CEC',
  '--color-text-table-row': '#E9ECEF',
  '--color-text-table-header': '#F8F9FA',
  '--color-text-boxscore-header': '#F8F9FA',

  // Background
  '--color-background-primary': '#212529',
  '--color-background-secondary': '#141419',
  '--color-background-primary-inverted': '#F8F9FA',
  '--color-background-secondary-inverted': '#E9ECEF',
  '--color-background-highlighted': '#1976D2',
  '--color-background-table-row': '#212529',
  '--color-background-table-header': '#141419',
  '--color-background-site-header': '#141419',
  '--color-background-boxscore-header': '#141419',
  '--color-background-scorebar-date': '#343A40',
};
