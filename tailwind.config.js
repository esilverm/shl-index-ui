const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.tsx', './components/**/*.tsx'],
  theme: {
    colors: {
      /* light themes */
      blue600: 'rgba(var(--blue600))',
      blue700: 'rgba(var(--blue700))',
      grey900: 'rgba(var(--grey900))',
      grey800: 'rgba(var(--grey800))',
      grey700: 'rgba(var(--grey700))',
      grey650: 'rgba(var(--grey650))',
      grey600: 'rgba(var(--grey600))',
      grey500: 'rgba(var(--grey500))',
      grey400: 'rgba(var(--grey400))',
      grey300: 'rgba(var(--grey300))',
      grey200: 'rgba(var(--grey200))',
      grey100: 'rgba(var(--grey100))',
      red200: 'rgba(var(--red200))',

      /* dark themes */
      hyperlink: 'rgba(var(--hyperlinkDark))',
      backgroundBlueDark: 'rgba(var(--backgroundBlueDark))',
      LabelHeadingsDark: 'rgba(var(--LabelHeadingsDark))',
      grey650Dark: 'rgba(var(--grey650Dark))',
      globalBorderGrey: 'rgba(var(--globalBorderGrey))',
      globalBackgroundGrey: 'rgba(var(--grey300Dark))',
      boxscoreBorderGrey: 'rgba(var(--boxscoreBorderGrey))',
      backgroundGrey100: 'rgba(var(--backgroundGrey100))',
      white: `rgba(var(--white))`,


    },
    fontFamily: {
      raleway: ['var(--font-raleway)', ...fontFamily.sans],
      mont: ['var(--font-montserrat)', ...fontFamily.sans],
    },
    extend: {},
  },
  plugins: [],
};
