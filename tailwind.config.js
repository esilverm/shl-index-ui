const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", ".chakra-ui-dark"],
  content: ['./pages/**/*.tsx', './components/**/*.tsx'],
  theme: {
    colors: {
      hyperlink: 'rgba(var(--hyperlink))',
      hyperlinkDark: 'rgba(var(--hyperlinkDark))',
      blue700: 'rgba(var(--blue700))',
      blue700Dark: 'rgba(var(--blue700Dark))',
      grey900: 'rgba(var(--grey900))',
      grey900Dark: 'rgba(var(--grey900Dark))',
      LabelHeadings: 'rgba(var(--LabelHeadings))',
      LabelHeadingsDark: 'rgba(var(--LabelHeadingsDark))',
      grey700: 'rgba(var(--grey700))',
      grey700Dark: 'rgba(var(--grey700Dark))',
      grey650: 'rgba(var(--grey650))',
      grey650Dark: 'rgba(var(--grey650Dark))',
      grey600: 'rgba(var(--grey600))',
      grey600Dark: 'rgba(var(--grey600Dark))',
      grey500: 'rgba(var(--grey500))',
      grey500Dark: 'rgba(var(--grey500Dark))',
      grey400: 'rgba(var(--grey400))',
      grey400Dark: 'rgba(var(--grey400Dark))',
      grey300: 'rgba(var(--grey300))',
      grey300Dark: 'rgba(var(--grey300Dark))',
      grey200: 'rgba(var(--grey200))',
      grey200Dark: 'rgba(var(--grey200Dark))',
      grey100: 'rgba(var(--grey100))',
      grey100Dark: 'rgba(var(--grey100Dark))',
      grey100TextDark: 'rgba(var(--grey100TextDark))',
      red200: 'rgba(var(--red200))',
      offWhite: `rgba(var(--offWhite))`,
      
    },
    fontFamily: {
      raleway: ['var(--font-raleway)', ...fontFamily.sans],
      mont: ['var(--font-montserrat)', ...fontFamily.sans],
    },
    extend: {},
  },
  plugins: [],
};
