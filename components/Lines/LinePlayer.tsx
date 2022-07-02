import React from 'react';
import styled from 'styled-components';

import { getPlayerShortname } from '../Game/BoxscoreTeamRosters';
import Link from '../LinkWithSeason';

const LinePlayer = ({
  player,
  position,
  league,
}: {
  player: { id: number; name: string };
  position: string;
  league: string;
}): JSX.Element => {
  return (
    <PlayerContainer>
      <Link
        href="/[league]/player/[id]"
        as={`/${league}/player/${player.id}`}
        passHref
      >
        <NameText>{getPlayerShortname(player.name)}</NameText>
      </Link>
      <PositionText>{position}</PositionText>
    </PlayerContainer>
  );
};

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 3rem;

  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin: 0 20px;
  overflow: hidden;
  white-space: nowrap;
  min-width: 200px;
  max-width: 350px;
`;

const NameText = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  cursor: pointer;

  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    color: ${({ theme }) => theme.colors.blue600};
    transition: all 200ms ease-out;
  }
`;

const PositionText = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;

export default LinePlayer;
