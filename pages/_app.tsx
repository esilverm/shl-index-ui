import '../styles/globals.css';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import { Raleway, Montserrat } from 'next/font/google';
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
          <CustomChakraProvider>
            <Component {...pageProps} />
          </CustomChakraProvider>
        </main>
      </Hydrate>
    </QueryClientProvider>
  );
};
