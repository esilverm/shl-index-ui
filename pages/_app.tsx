import '../styles/globals.css';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { Raleway, Montserrat } from 'next/font/google';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';
import React from 'react';

import SEO from '../next-seo.config';
import { CustomChakraProvider } from '../styles/CustomChakraProvider';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal'],
  variable: '--font-montserrat',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal'],
  variable: '--font-raleway',
});

export default ({ Component, pageProps }: AppProps) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <main
          className={`${montserrat.variable} ${raleway.variable} font-raleway`}
        >
          <DefaultSeo {...SEO} />
          <ThemeProvider
            attribute="class"
            storageKey="index-theme"
            themes={['light', 'dark']}
            value={{
              light: 'index-theme-light',
              dark: 'index-theme-dark',
            }}
            enableColorScheme={false}
          >
            <CustomChakraProvider>
              <Component {...pageProps} />
            </CustomChakraProvider>
          </ThemeProvider>
        </main>
      </Hydrate>
    </QueryClientProvider>
  );
};
