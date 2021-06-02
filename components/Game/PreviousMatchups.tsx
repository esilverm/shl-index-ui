import React from 'react';
import styled from 'styled-components';
import LinkWithSeason from '../LinkWithSeason';
import { Matchup } from '../../pages/api/v1/schedule/game/[gameId]';
import { SectionTitle, TeamLogoSmall } from './common';

interface Props {
  gameData: Matchup;
  Sprites: {
    [index: string]: React.ComponentClass<any>;
  };
  league: string;
  season: string;
}

const PreviousMatchups = ({
  gameData,
  Sprites,
  league,
  season,
}: Props): JSX.Element => {
  const renderPreviousMatchups = (previouslyPlayedMatchups) =>
    previouslyPlayedMatchups.map((matchup) => (
      <LinkWithSeason
        href="/[league]/[season]/game/[gameid]"
        as={`/${league}/${season}/game/${matchup.slug}`}
        passHref
        key={matchup.slug}
      >
        <MatchupRow isGame>
          <GameDate>
            {matchup.date} {matchup.played ? ' • Final' : ' • Not Played'}
          </GameDate>
          <MatchupTeamRow>
            <TeamLogoSmall>
              {matchup.awayTeam === gameData.game.awayTeam ? (
                <Sprites.Away />
              ) : (
                <Sprites.Home />
              )}
            </TeamLogoSmall>
            <span>
              {matchup.awayTeam === gameData.game.awayTeam
                ? gameData.teams.away.nickname
                : gameData.teams.home.nickname}
            </span>
            <MatchupRowScore lost={matchup.awayScore < matchup.homeScore}>
              {matchup.played ? matchup.awayScore : ''}
            </MatchupRowScore>
          </MatchupTeamRow>
          <MatchupTeamRow>
            <TeamLogoSmall>
              {matchup.homeTeam === gameData.game.homeTeam ? (
                <Sprites.Home />
              ) : (
                <Sprites.Away />
              )}
            </TeamLogoSmall>
            <span>
              {matchup.homeTeam === gameData.game.homeTeam
                ? gameData.teams.home.nickname
                : gameData.teams.away.nickname}
            </span>
            <MatchupRowScore lost={matchup.homeScore < matchup.awayScore}>
              {matchup.played ? matchup.homeScore : ''}
            </MatchupRowScore>
          </MatchupTeamRow>
        </MatchupRow>
      </LinkWithSeason>
    ));

  const previouslyPlayedMatchups = gameData.previousMatchups;
  // const previouslyPlayedMatchups = gameData.previousMatchups.filter(
  //   (game) => game.played === 1
  // );

  return (
    <PreviousMatchupsContainer>
      <MatchupsHeader>
        <SectionTitle>{`${gameData.game.type} Series`}</SectionTitle>
      </MatchupsHeader>
      {previouslyPlayedMatchups.length > 0 &&
        renderPreviousMatchups(previouslyPlayedMatchups)}
      {previouslyPlayedMatchups.length === 0 && (
        <MatchupRow>
          <div>No previous games played</div>
        </MatchupRow>
      )}
    </PreviousMatchupsContainer>
  );
};

const PreviousMatchupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.grey100};

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
  font-weight: 500;

  div:first-child {
    margin-right: 10px;
    font-weight: 500;
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
  padding: 10px 15px;
`;

const MatchupRow = styled.div<{
  isGame?: boolean;
}>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 15px 15px 15px 15px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};

  * {
    padding-bottom: 5px;
  }

  span:first-child {
    font-family: Montserrat, sans-serif;
    font-size: 14px;
    margin-bottom: 10px;
  }

  ${({ isGame = false }) =>
    isGame
      ? `
    cursor: pointer;
    &:hover {
      filter: brightness(0.8);
    }
  `
      : ``}
`;

const GameDate = styled.span`
  font-weight: 500;
`;

export default PreviousMatchups;
