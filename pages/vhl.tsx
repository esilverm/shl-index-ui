/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import styled from 'styled-components';

export default function VHL(): JSX.Element {
  return (
    <React.Fragment>
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
