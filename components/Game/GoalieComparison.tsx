import React from 'react';
import styled from 'styled-components';
import { GoalieStats, Matchup } from '../../pages/api/v1/schedule/game/[gameId]';
import { ComparisonHeader, FlexColumn, FlexRow, SectionTitle, TeamLogoSmall } from './common';

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

  const renderGoalieStatsWithSharedLabels = () => {
    const awayGoaliesSorted = sortByGamesPlayed(gameData.goalieStats.away);
    const homeGoaliesSorted = sortByGamesPlayed(gameData.goalieStats.home);

    return [0, 1].map((index) => {
      const awayGoalie = awayGoaliesSorted[index];
      const homeGoalie = homeGoaliesSorted[index];
      if (!awayGoalie && !homeGoalie) return null;

      return (
        <GoalieFlexColumn key={index}>
          <GoalieFlexRow>
            <div className={'away'}>
              <GoalieName>
                {awayGoalie && awayGoalie.name}
              </GoalieName>
            </div>
            <span></span>
            <div className={'home'}>
              <GoalieName>
                {homeGoalie && homeGoalie.name}
              </GoalieName>
            </div>
          </GoalieFlexRow>
          <GoalieFlexRow>
            <GoalieStat>
              <span>{awayGoalie ? `${awayGoalie.wins}-${awayGoalie.losses}-${awayGoalie.OT}` : ''}</span>
              <span>{statLabels.record}</span>
              <span>{homeGoalie ? `${homeGoalie.wins}-${homeGoalie.losses}-${homeGoalie.OT}` : ''}</span>
            </GoalieStat>
          </GoalieFlexRow>
          {Object.keys(awayGoalie).map((stat) => {
            if (!Object.keys(statLabels).includes(stat)) return null;

            return (
              <GoalieFlexRow key={stat}>
                <GoalieStat>
                  <span>{awayGoalie && awayGoalie[stat]}</span>
                  <span>{statLabels[stat]}</span>
                  <span>{homeGoalie && homeGoalie[stat]}</span>
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
        <SectionTitle>
          Goaltender Comparison
        </SectionTitle>
        <TeamLogoSmall>
          <Sprites.Home />
        </TeamLogoSmall>
      </ComparisonHeader>
      <GoalieStatsBlock>
        <TeamGoaliesWide>
          {renderAwayGoalieStats('away')}
        </TeamGoaliesWide>
        <TeamGoaliesWide home>
          {renderAwayGoalieStats('home')}
        </TeamGoaliesWide>
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
  
    > div:first-child {
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

  div.away, div.home {
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
  color: ${({ theme }) => theme.colors.grey600};

  span:last-child {
    font-weight: 600;
  }
  
  @media screen and (max-width: 900px) {
    width: 100%;
    font-weight: 600;
    margin-top: 5px;
    flex-direction: row;
    justify-content: space-between;

    > span:first-child {
      width: 50%;
    }

    > span:last-child {
      width: 50%;
      text-align: right;
    }

    > span:nth-child(2) {
      width: 60px;
      text-align: center;
    }
  }
`;

export default GoalieComparison;
