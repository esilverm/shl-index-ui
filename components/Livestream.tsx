import React, { useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import styled from 'styled-components';
import useSWR from 'swr';

import { LivestreamData } from '../pages/api/v1/livestreams/index';

function Livestream({ currentLeague = 'shl' }: { currentLeague: string }): JSX.Element {
  const [isLive, setIsLive] = useState(false);

  const league = currentLeague;

  const { data: livestreamData, error: livestreamError } = useSWR<Array<LivestreamData>>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/livestreams?league=${league}`
  );

  const videoID = livestreamData ? livestreamData[0].videoId : '';

  useEffect(() => {
    if (livestreamData && livestreamData[0].isLive === 'live') {
      setIsLive(true);
    }
  }, [livestreamData]);

  return (
    <>
      <Title>{isLive ? 'Current' : 'Most Recent'} Livestream</Title>
      <Container>
      {!livestreamData && !livestreamError && (
        <CenteredContent>
          <PulseLoader size={15} />
        </CenteredContent>
      )}
      {livestreamData && !livestreamError && (
          <LivestreamIFrame
            src={`https://www.youtube-nocookie.com/embed/${videoID}?autoplay=1&mute=1&color=white&rel=0`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
      )}
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;

  &:before {
    content: '';
    display: block;
    padding-bottom: calc(100% / (16 / 9));
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  padding-bottom: 1rem;
`;

const LivestreamIFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`;

export default Livestream;
