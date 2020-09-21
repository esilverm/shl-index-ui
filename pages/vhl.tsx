/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import styled from 'styled-components';
import { NextSeo } from 'next-seo';

export default function VHL(): JSX.Element {
  return (
    <React.Fragment>
      <NextSeo
        title="VHL"
        titleTemplate="%s | SHL Index"
        description="The Simulation Hockey League is a free online forums based sim league where you create your own fantasy hockey player. Join today and create your player, get drafted, sign contracts, become a GM, make trades and compete against 1,800 players from around the world."
        // canonical=""
        openGraph={{
          url: '',
          site_name: 'SHL',
          title: 'Home',
          description:
            'The Simulation Hockey League is a free online forums based sim league where you create your own fantasy hockey player. Join today and create your player, get drafted, sign contracts, become a GM, make trades and compete against 1,800 players from around the world.',
        }}
      />
      <BackgroundVideo autoPlay loop muted>
        <source src="/404.webm" type="video/webm" />
        <source src="/404.mp4" type="video/mp4" />
      </BackgroundVideo>
    </React.Fragment>
  );
}

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  object-fit: fill;
`;
