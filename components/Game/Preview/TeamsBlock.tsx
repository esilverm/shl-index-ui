import React from 'react';
import styled from 'styled-components';
import { Matchup } from '../../../pages/api/v1/schedule/game/[gameId]';
import { FlexColumn, FlexRow, SectionTitle } from '../common';

interface Props {
  gameData: Matchup;
  Sprites: {
    [index: string]: React.ComponentClass<any>;
  };
}

const TeamsBlock = ({ gameData, Sprites }: Props): JSX.Element => (
  <TeamsPreview>
    <FlexColumn>
      <GameDate>
        <SectionTitle>
          {gameData.game.date}
        </SectionTitle>
      </GameDate>
      <FlexRow>
        <TeamData>
          <TeamLogo>
            <Sprites.Away />
          </TeamLogo>
          <FlexColumn>
            <TeamName>
              {`${gameData.teams.away.name} ${gameData.teams.away.nickname}`}
            </TeamName>
            <TeamRecord>
              {gameData.teamStats.away.record}
            </TeamRecord>
          </FlexColumn>
        </TeamData>
        <TeamData>
          <FlexColumn>
            <TeamName home>
              {`${gameData.teams.home.name} ${gameData.teams.home.nickname}`}
            </TeamName>
            <TeamRecord home>
              {gameData.teamStats.home.record}
            </TeamRecord>
          </FlexColumn>
          <TeamLogo>
            <Sprites.Home />
          </TeamLogo>
        </TeamData>
      </FlexRow>
    </FlexColumn>
  </TeamsPreview>
);

const TeamsPreview = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 0 15px 15px 15px;
`;

const TeamData = styled.div`
  display: flex;
  flex-direction: row;
`;

const GameDate = styled.div`
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 4px solid ${({ theme }) => theme.colors.grey300};
  margin-bottom: 10px;
  padding 10px 0;
`;

const TeamName = styled.span<{
  home?: boolean;
}>`
  text-align: ${({ home }) => home ? 'right' : 'left'};
  padding: 0 10px;
  font-weight: 600;
`;

const TeamRecord = styled.span<{
  home?: boolean;
}>`
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  text-align: ${({ home }) => home ? 'right' : 'left'};
  padding: 0 10px;
  color: ${({ theme }) => theme.colors.grey600};
`;

const TeamLogo = styled.div`
  width: 50px;
  height: 50px;
`;

export default TeamsBlock;
