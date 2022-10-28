import React from 'react';
import styled from 'styled-components';

import LinePlayer from './LinePlayer';
const Line = ({
  lineup,
  league,
}: {
  lineup: { [key: string]: { id: number; name: string } };
  league: string;
}): JSX.Element => {
  return (
    <LineContainer>
      <InnerPlayersContainer>
        {lineup['LW'] && (
          <LinePlayer player={lineup['LW']} position="LW" league={league} />
        )}
        {lineup['C'] && (
          <LinePlayer player={lineup['C']} position="C" league={league} />
        )}
        {lineup['RW'] && (
          <LinePlayer player={lineup['RW']} position="RW" league={league} />
        )}
      </InnerPlayersContainer>
      <InnerPlayersContainer>
        {lineup['LD'] && (
          <LinePlayer player={lineup['LD']} position="LD" league={league} />
        )}
        {lineup['RD'] && (
          <LinePlayer player={lineup['RD']} position="RD" league={league} />
        )}
      </InnerPlayersContainer>
    </LineContainer>
  );
};

const LineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;

  scroll-snap-align: start;
  margin-bottom: 20px;
`;

const InnerPlayersContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;

  margin-bottom: 20px;
`;

export default Line;
