import React from 'react';
import styled from 'styled-components';
import { Matchup } from '../../pages/api/v1/schedule/game/[gameId]';
import { FlexRow, SectionTitle, TeamLogoSmall } from './common';

interface Props {
  gameData: Matchup;
  Sprites: {
    [index: string]: React.ComponentClass<any>;
  };
}

const TeamStats = ({ gameData, Sprites }: Props): JSX.Element => {
  const renderTeamStats = () => {
    const stats = {
      goalsForPerGame: {
        title: 'GF/GP',
        away: {
          total: 0,
          perc: 0,
        },
        home: {
          total: 0,
          perc: 0,
        },
      },
      goalsAgainstPerGame: {
        title: 'GA/GP',
        away: {
          total: 0,
          perc: 0,
        },
        home: {
          total: 0,
          perc: 0,
        },
      },
    };
    const awayColor = gameData.teams.away.primaryColor;
    const homeColor = gameData.teams.home.primaryColor;
    Object.keys(gameData.teamStats).forEach((team) => {
      stats.goalsForPerGame[team].total = parseFloat(
        (
          gameData.teamStats[team].goalsFor /
          gameData.teamStats[team].gamesPlayed
        ).toFixed(2)
      );
      stats.goalsAgainstPerGame[team].total = parseFloat(
        (
          gameData.teamStats[team].goalsAgainst /
          gameData.teamStats[team].gamesPlayed
        ).toFixed(2)
      );
    });
    stats.goalsForPerGame.away.perc =
      (stats.goalsForPerGame.away.total /
        (stats.goalsForPerGame.away.total + stats.goalsForPerGame.home.total)) *
      100;
    stats.goalsAgainstPerGame.away.perc =
      (stats.goalsAgainstPerGame.home.total /
        (stats.goalsAgainstPerGame.away.total +
          stats.goalsAgainstPerGame.home.total)) *
      100;

    return (
      <>
        <TeamStatsRow>
          <StatValue>{stats.goalsForPerGame.away.total}</StatValue>
          <StatTitle>{stats.goalsForPerGame.title}</StatTitle>
          <StatValue home>{stats.goalsForPerGame.home.total}</StatValue>
        </TeamStatsRow>
        <TeamStatsBar
          awayColor={awayColor}
          awayPerc={stats.goalsForPerGame.away.perc}
          homeColor={homeColor}
        />
        <TeamStatsRow>
          <StatValue>{stats.goalsAgainstPerGame.away.total}</StatValue>
          <StatTitle>{stats.goalsAgainstPerGame.title}</StatTitle>
          <StatValue home>{stats.goalsAgainstPerGame.home.total}</StatValue>
        </TeamStatsRow>
        <TeamStatsBar
          awayColor={awayColor}
          awayPerc={stats.goalsAgainstPerGame.away.perc}
          homeColor={homeColor}
        />
      </>
    );
  };

  const titlePrefix = gameData.game.played ? 'Seasonal ' : '';

  return (
    <TeamStatsContainer>
      <TeamStatsHeader>
        <FlexRow height={50}>
          <TeamLogoSmall>
            <Sprites.Away />
          </TeamLogoSmall>
          <SectionTitle>{`${titlePrefix}Team Stats`}</SectionTitle>
          <TeamLogoSmall>
            <Sprites.Home />
          </TeamLogoSmall>
        </FlexRow>
      </TeamStatsHeader>
      {renderTeamStats()}
    </TeamStatsContainer>
  );
};

const TeamStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 15px;
`;

const TeamStatsHeader = styled.div`
  font-weight: 600;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
`;

const TeamStatsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 15px;
  padding-bottom: 5px;
`;

const TeamStatsBar = styled.div<{
  awayColor: string;
  awayPerc: number;
  homeColor: string;
}>`
  border: 2px solid;
  border-image: ${(props) => `
    linear-gradient(to right,
      ${props.awayColor} 0%,
      ${props.awayColor} ${props.awayPerc}%,
      ${props.theme.colors.grey100} ${props.awayPerc}%,
      ${props.theme.colors.grey100} ${props.awayPerc + 1}%,
      ${props.homeColor} ${props.awayPerc + 1}%,
      ${props.homeColor} 100%
    ) 5`};
`;

const StatTitle = styled.span`
  font-size: 16px;
`;

const StatValue = styled.span<{
  home?: boolean;
}>`
  font-family: Montserrat, sans-serif;
  font-size: 22px;
  font-weight: 600;
  flex: 1;
  ${({ home }) => home && 'text-align: right;'};
`;

export default TeamStats;
