import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { DefaultSeo } from 'next-seo';
import { SWRConfig } from 'swr';

import whyDidYouRender from '@welldone-software/why-did-you-render';

import SEO from '../next-seo.config';

const theme = {
  colors: {
    grey900: '#212529',
    grey800: '#343A40',
    grey700: '#495057',
    grey650: '#6B737B',
    grey600: '#6C757D',
    grey500: '#ADB5BD',
    grey400: '#CED4DA',
    grey300: '#DEE2E6',
    grey200: '#E9ECEF',
    grey100: '#F8F9FA',
  },
};

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  whyDidYouRender(React);
}

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <ThemeProvider theme={theme}>
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
        <style global jsx>{`
          body {
            font-family: 'Raleway', sans-serif;
            background-color: ${theme.colors.grey200};
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `}</style>
      </ThemeProvider>
    </SWRConfig>
  );
}
