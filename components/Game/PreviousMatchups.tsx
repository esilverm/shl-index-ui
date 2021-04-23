import React from 'react';
import styled from 'styled-components';
import { Matchup } from '../../pages/api/v1/schedule/game/[gameId]';
import { SectionTitle, TeamLogoSmall } from './common';

interface Props {
  gameData: Matchup;
  Sprites: {
    [index: string]: React.ComponentClass<any>;
  };
}

const PreviousMatchups = ({ gameData, Sprites }: Props): JSX.Element => {
  const renderPreviousMatchups = () => gameData.previousMatchups.map((matchup) => (
    <MatchupRow key={matchup.slug}>
      <SectionTitle>
        {matchup.date}
      </SectionTitle>
      <MatchupTeamRow>
        <TeamLogoSmall>
          {matchup.awayTeam === gameData.game.awayTeam ? <Sprites.Away /> : <Sprites.Home />}
        </TeamLogoSmall>
        <span>{matchup.awayTeam === gameData.game.awayTeam ? gameData.teams.away.nickname : gameData.teams.home.nickname}</span>
        <MatchupRowScore lost={matchup.awayScore < matchup.homeScore}>{matchup.awayScore}</MatchupRowScore>
      </MatchupTeamRow>
      <MatchupTeamRow>
        <TeamLogoSmall>
          {matchup.homeTeam === gameData.game.homeTeam ? <Sprites.Home /> : <Sprites.Away />}
        </TeamLogoSmall>
        <span>{matchup.homeTeam === gameData.game.homeTeam ? gameData.teams.home.nickname : gameData.teams.away.nickname}</span>
        <MatchupRowScore lost={matchup.homeScore < matchup.awayScore}>{matchup.homeScore}</MatchupRowScore>
      </MatchupTeamRow>
    </MatchupRow>
  ));

  return (
    <PreviousMatchupsContainer>
      <MatchupsHeader>
        <SectionTitle>
          {`${gameData.game.type} Series`}
        </SectionTitle>
      </MatchupsHeader>
      {gameData.previousMatchups.length > 0 && renderPreviousMatchups()}
      {gameData.previousMatchups.length === 0 && (
        <MatchupRow>
          <div>
            No previous games played
          </div>
        </MatchupRow>
      )}
    </PreviousMatchupsContainer>
  );
};

const PreviousMatchupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 0 15px;

  div:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const MatchupTeamRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  font-weight: 600;

  div:first-child {
    margin-right: 10px;
  }
`;

const MatchupRowScore = styled.span<{
  lost?: boolean;
}>`
  ${({ lost, theme }) => lost && `color: ${theme.colors.grey500};`};
  font-family: Montserrat, sans-serif;
  margin-left: auto;
  font-size: 16px;
`;

const MatchupsHeader = styled.div`
  font-weight: 600;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
  margin-bottom: 10px;
  padding: 10px 0;
`;

const MatchupRow = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};

  * {
    padding-bottom: 5px;
  }

  span:first-child {
    font-family: Montserrat, sans-serif;
    font-size: 14px;
    margin-bottom: 10px;
  }
`;

export default PreviousMatchups;
