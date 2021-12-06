import React from 'react';
import styled from 'styled-components';

import {
  GoalieStats,
  Matchup,
} from '../../pages/api/v1/schedule/game/[gameId]';

import {
  ComparisonHeader,
  FlexColumn,
  FlexRow,
  SectionTitle,
  TeamLogoSmall,
} from './common';

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
    shutouts: 'SO',
  };

  const sortByGamesPlayed = (goalies: Array<GoalieStats>) =>
    goalies.sort((a, b) =>
      a.wins + a.losses + a.OT > b.wins + b.losses + b.OT ? -1 : 1
    );

  const renderGoalieStats = (team: 'away' | 'home') =>
    Object.values(sortByGamesPlayed(gameData.goalieStats[team])).map(
      (goalie, i) => (
        <React.Fragment key={`goalie_${goalie.name}_${i}`}>
          <GoalieName>{goalie.name}</GoalieName>
          <FlexRow>
            <GoalieStat>
              <span>{statLabels.record}</span>
              <span>{`${goalie.wins}-${goalie.losses}-${goalie.OT}`}</span>
            </GoalieStat>
            {Object.keys(goalie).map((stat, i) => {
              if (!Object.keys(statLabels).includes(stat)) return null;

              return (
                <GoalieStat key={`${stat}_${i}_${goalie.name}`}>
                  <span>{statLabels[stat]}</span>
                  <span>
                    {stat === 'savePct'
                      ? goalie[stat].toFixed(3)
                      : goalie[stat]}
                  </span>
                </GoalieStat>
              );
            })}
          </FlexRow>
        </React.Fragment>
      )
    );

  const renderGoalieStatsWithSharedLabels = () => {
    const awayGoaliesSorted = sortByGamesPlayed(gameData.goalieStats.away);
    const homeGoaliesSorted = sortByGamesPlayed(gameData.goalieStats.home);
    const maxNumGoalies = Math.max(
      awayGoaliesSorted.length,
      homeGoaliesSorted.length
    );

    return new Array(maxNumGoalies).fill(0).map((_, index) => {
      const awayGoalie = awayGoaliesSorted[index];
      const homeGoalie = homeGoaliesSorted[index];
      if (!awayGoalie && !homeGoalie) return null;

      return (
        <GoalieFlexColumn key={index}>
          <GoalieFlexRow>
            <div className={'away'}>
              <GoalieName>{awayGoalie && awayGoalie.name}</GoalieName>
            </div>
            <span />
            <div className={'home'}>
              <GoalieName>{homeGoalie && homeGoalie.name}</GoalieName>
            </div>
          </GoalieFlexRow>
          <GoalieFlexRow>
            <GoalieStat>
              <span>
                {awayGoalie
                  ? `${awayGoalie.wins}-${awayGoalie.losses}-${awayGoalie.OT}`
                  : ''}
              </span>
              <span>{statLabels.record}</span>
              <span>
                {homeGoalie
                  ? `${homeGoalie.wins}-${homeGoalie.losses}-${homeGoalie.OT}`
                  : ''}
              </span>
            </GoalieStat>
          </GoalieFlexRow>
          {Object.keys(statLabels).map((stat, i) => {
            if (stat === 'record') return null;

            return (
              <GoalieFlexRow key={`${stat}_${i}`}>
                <GoalieStat>
                  <span>
                    {awayGoalie &&
                      (stat === 'savePct'
                        ? awayGoalie[stat].toFixed(3)
                        : stat === 'GAA'
                        ? awayGoalie[stat].toFixed(2)
                        : awayGoalie[stat])}
                  </span>
                  <span>{statLabels[stat]}</span>
                  <span>
                    {homeGoalie &&
                      (stat === 'savePct'
                        ? homeGoalie[stat].toFixed(3)
                        : stat === 'GAA'
                        ? homeGoalie[stat].toFixed(2)
                        : homeGoalie[stat])}
                  </span>
                </GoalieStat>
              </GoalieFlexRow>
            );
          })}
        </GoalieFlexColumn>
      );
    });
  };

  return (
    <GoalieComparisonContainer>
      <ComparisonHeader>
        <TeamLogoSmall>
          <Sprites.Away />
        </TeamLogoSmall>
        <SectionTitle>Goaltender Comparison</SectionTitle>
        <TeamLogoSmall>
          <Sprites.Home />
        </TeamLogoSmall>
      </ComparisonHeader>
      <GoalieStatsBlock>
        <TeamGoaliesWide>{renderGoalieStats('away')}</TeamGoaliesWide>
        <TeamGoaliesWide home>{renderGoalieStats('home')}</TeamGoaliesWide>
        <TeamGoaliesNarrow>
          {renderGoalieStatsWithSharedLabels()}
        </TeamGoaliesNarrow>
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

  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const TeamGoaliesWide = styled.div<{
  home?: boolean;
}>`
  display: flex;
  flex-direction: column;
  width: 200px;
  ${({ home }) => home && `text-align: right;`}

  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const TeamGoaliesNarrow = styled.div`
  display: none;

  @media screen and (max-width: 900px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > div:not(:last-child) {
      border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
    }

    * > span {
      height: 20px;
    }
  }
`;

const GoalieFlexColumn = styled(FlexColumn)`
  padding: 10px 0;
`;

const GoalieFlexRow = styled.div<{
  home?: boolean;
  width?: number;
}>`
  display: flex;
  flex-direction: row;
  word-break: break-all;
  align-items: center;
  justify-content: space-between;

  div.away,
  div.home {
    width: 50%;
  }

  div.home {
    text-align: right;
  }
`;

const GoalieName = styled.span`
  font-weight: 600;
  margin-top: 15px;
  word-break: break-word;

  @media screen and (max-width: 900px) {
    margin-top: 0;
  }
`;

const GoalieStat = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grey800};

  span:last-child {
    color: ${({ theme }) => theme.colors.grey600};
    font-weight: 600;
  }

  @media screen and (max-width: 900px) {
    width: 100%;
    font-weight: 600;
    margin-top: 5px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > span:first-child {
      width: 20%;
      text-align: left;
    }

    > span:nth-child(2) {
      text-align: center;
    }

    > span:last-child {
      width: 20%;
      text-align: right;
    }
  }
`;

export default GoalieComparison;
