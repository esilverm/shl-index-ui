import React, { useState } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';

function Livestream({ isSHL = true }: { isSHL?: boolean }): JSX.Element {
  const [isLive, setIsLive] = useState(false);

  const { data: videoID } = useSWR('youtube', () => {
    return fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${
        isSHL
          ? process.env.NEXT_PUBLIC_SHL_CHANNEL_ID
          : process.env.NEXT_PUBLIC_SMJHL_CHANNEL_ID
      }&type=video&order=date&maxResults=1&key=${
        process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.items && res.items.length >= 1) {
          const streamInfo = res.items[0];
          setIsLive(streamInfo.liveBroadcastContent === 'live');
          return streamInfo.id.videoId;
        }

      });
  });
  

  return (
    <>
      <Title>{isLive ? 'Current' : 'Most Recent'} Livestream</Title>
      <Container>
        <LivestreamIFrame
          src={`https://www.youtube-nocookie.com/embed/${videoID}?autoplay=1&mute=1&color=white&rel=0`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
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

export default Livestream;
