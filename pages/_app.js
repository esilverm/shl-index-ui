/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    grey900: '#212529',
    grey800: '#343A40',
    grey700: '#495057',
    grey600: '#6C757D',
    grey500: '#ADB5BD',
    grey400: '#CED4DA',
    grey300: '#DEE2E6',
    grey200: '#E9ECEF',
    grey100: '#F8F9FA',
  },
};

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
            key="google-font-raleway"
          />
        </Head>
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
    );
  }
}
