import React from 'react';
import styled from 'styled-components';
import { GoalieStats, Matchup } from '../../../pages/api/v1/schedule/game/[gameId]';
import { ComparisonHeader, FlexRow, SectionTitle, TeamLogoSmall } from '../common';

interface Props {
  gameData: Matchup;
  Sprites: {
    [index: string]: React.ComponentClass<any>;
  };
}

const GoalieComparison = ({ gameData, Sprites }: Props): JSX.Element => {
  const statLabels = {
    record: 'Record',
    GAA: 'GAA',
    savePct: 'SV%',
    shutouts: 'SO'
  };

  const sortByGamesPlayed = (goalies: Array<GoalieStats>) => goalies.sort((a, b) => (a.wins + a.losses + a.OT > b.wins + b.losses + b.OT) ? -1 : 1);

  const renderAwayGoalieStats = (team: 'away' | 'home') => Object.values(sortByGamesPlayed(gameData.goalieStats[team])).map((goalie) => (
    <>
      <GoalieName>
        {goalie.name}
      </GoalieName>
      <FlexRow>
        <GoalieStat>
          <span>{statLabels.record}</span>
          <span>{`${goalie.wins}-${goalie.losses}-${goalie.OT}`}</span>
        </GoalieStat>
        {Object.keys(goalie).map((stat) => {
          if (!Object.keys(statLabels).includes(stat)) return null;

          return (
            <GoalieStat key={stat}>
              <span>{statLabels[stat]}</span>
              <span>{goalie[stat]}</span>
            </GoalieStat>
          );
        })}
      </FlexRow>
    </>
  ));

  return (
    <GoalieComparisonContainer>
      <ComparisonHeader>
        <TeamLogoSmall>
          <Sprites.Away />
        </TeamLogoSmall>
        <SectionTitle>
          Goaltender Comparison
        </SectionTitle>
        <TeamLogoSmall>
          <Sprites.Home />
        </TeamLogoSmall>
      </ComparisonHeader>
      <GoalieStatsBlock>
        <TeamGoalies>
          {renderAwayGoalieStats('away')}
        </TeamGoalies>
        <TeamGoalies home>
          {renderAwayGoalieStats('home')}
        </TeamGoalies>
      </GoalieStatsBlock>
    </GoalieComparisonContainer>
  );
};

const GoalieComparisonContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 15px;
  margin-top: 10px;
`;

const GoalieStatsBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TeamGoalies = styled.div<{
  home?: boolean;
}>`
  display: flex;
  flex-direction: column;
  width: 200px;
  ${({ home }) => home && `text-align: right;`}
`;

const GoalieName = styled.span`
  font-weight: 600;
  margin-top: 15px;
`;

const GoalieStat = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grey600};

  span:last-child {
    font-weight: 600;
  }
`;

export default GoalieComparison;
