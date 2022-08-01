import React from 'react';
import styled from 'styled-components';
import tinycolor from 'tinycolor2';

import { getPlayerShortname } from './BoxscoreTeamRosters';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const BoxscorePeriodScoring = ({ gameData, Sprites }): JSX.Element => {
  const { scoring } = gameData.boxscore;
  const { overtime, shootout, homeTeam } = gameData.game;
  const { teams } = gameData;

  const firstPeriodGoals = scoring.filter((goal) => goal.period === 1);
  const secondPeriodGoals = scoring.filter((goal) => goal.period === 2);
  const thirdPeriodGoals = scoring.filter((goal) => goal.period === 3);
  const overtimeGoals = scoring.filter((goal) => goal.period === 0);

  return (
    <TeamsPreview>
      {/* Period 1 */}
      <>
        <PeriodName>1st Period</PeriodName>
        {firstPeriodGoals.length > 0 ? (
          firstPeriodGoals.map((goal, index) => {
            const isHomeTeam = goal.team.id === homeTeam;

            const goalHasAssist = goal.primaryAssist !== null;
            const GoalScorerLogo = Sprites[isHomeTeam ? 'Home' : 'Away'];

            // get away team score to this point
            const awayTeamScore = scoring.reduce((acc, curr, currIndex) => {
              if (curr.team.id === teams.away.id && currIndex <= index) {
                return acc + 1;
              }
              return acc;
            }, 0);
            const homeTeamScore = scoring.reduce((acc, curr, currIndex) => {
              if (curr.team.id === teams.home.id && currIndex <= index) {
                return acc + 1;
              }
              return acc;
            }, 0);
            return (
              <GoalContainer key={index}>
                <TeamLogo>
                  <GoalScorerLogo />
                </TeamLogo>
                <GoalInfoContainer>
                  <div className="scorer">{goal.scorer.name}</div>
                  <div className="assists">
                    {!goalHasAssist
                      ? 'Unassisted'
                      : `${getPlayerShortname(goal.primaryAssist.name)}${
                          goal.secondaryAssist !== null
                            ? ', ' +
                              getPlayerShortname(goal.secondaryAssist.name)
                            : ''
                        }`}
                  </div>
                  <GoalInfo
                    color={goal.team.primaryColor}
                    isDark={tinycolor(goal.team.primaryColor).isDark()}
                    isHome={isHomeTeam}
                  >
                    <div title={goal.time}>{goal.readableTime} / 1st</div>
                    <div>
                      <span className="away">
                        {teams.away.abbr} {awayTeamScore}
                      </span>
                      ,{' '}
                      <span className="home">
                        {teams.home.abbr} {homeTeamScore}
                      </span>
                    </div>
                    {goal.goalType === 'PP' && <div>PPG</div>}
                    {goal.goalType === 'SH' && <div>SHG</div>}
                  </GoalInfo>
                </GoalInfoContainer>
              </GoalContainer>
            );
          })
        ) : (
          <GoalContainer>No Goals</GoalContainer>
        )}
      </>
      {/* Period 2 */}
      <>
        <PeriodName>2nd Period</PeriodName>
        {secondPeriodGoals.length > 0 ? (
          secondPeriodGoals.map((goal, index) => {
            const isHomeTeam = goal.team.id === homeTeam;

            const goalHasAssist = goal.primaryAssist !== null;
            const GoalScorerLogo = Sprites[isHomeTeam ? 'Home' : 'Away'];

            // get away team score to this point
            const awayTeamScore = scoring.reduce((acc, curr, currIndex) => {
              if (
                curr.team.id === teams.away.id &&
                currIndex <= index + firstPeriodGoals.length
              ) {
                return acc + 1;
              }
              return acc;
            }, 0);
            const homeTeamScore = scoring.reduce((acc, curr, currIndex) => {
              if (
                curr.team.id === teams.home.id &&
                currIndex <= index + firstPeriodGoals.length
              ) {
                return acc + 1;
              }
              return acc;
            }, 0);
            return (
              <GoalContainer key={index}>
                <TeamLogo>
                  <GoalScorerLogo />
                </TeamLogo>
                <GoalInfoContainer>
                  <div className="scorer">{goal.scorer.name}</div>
                  <div className="assists">
                    {!goalHasAssist
                      ? 'Unassisted'
                      : `${getPlayerShortname(goal.primaryAssist.name)}${
                          goal.secondaryAssist !== null
                            ? ', ' +
                              getPlayerShortname(goal.secondaryAssist.name)
                            : ''
                        }`}
                  </div>
                  <GoalInfo
                    color={goal.team.primaryColor}
                    isDark={tinycolor(goal.team.primaryColor).isDark()}
                    isHome={isHomeTeam}
                  >
                    <div title={goal.time}>{goal.readableTime} / 2nd</div>
                    <div>
                      <span className="away">
                        {teams.away.abbr} {awayTeamScore}
                      </span>
                      ,{' '}
                      <span className="home">
                        {teams.home.abbr} {homeTeamScore}
                      </span>
                    </div>
                    {goal.goalType === 'PP' && <div>PPG</div>}
                    {goal.goalType === 'SH' && <div>SHG</div>}
                  </GoalInfo>
                </GoalInfoContainer>
              </GoalContainer>
            );
          })
        ) : (
          <GoalContainer>No Goals</GoalContainer>
        )}
      </>
      {/* Period 3 */}
      <>
        <PeriodName>3rd Period</PeriodName>
        {thirdPeriodGoals.length > 0 ? (
          thirdPeriodGoals.map((goal, index) => {
            const isHomeTeam = goal.team.id === homeTeam;

            const goalHasAssist = goal.primaryAssist !== null;
            const GoalScorerLogo = Sprites[isHomeTeam ? 'Home' : 'Away'];

            // get away team score to this point
            const awayTeamScore = scoring.reduce((acc, curr, currIndex) => {
              if (
                curr.team.id === teams.away.id &&
                currIndex <=
                  index + firstPeriodGoals.length + secondPeriodGoals.length
              ) {
                return acc + 1;
              }
              return acc;
            }, 0);
            const homeTeamScore = scoring.reduce((acc, curr, currIndex) => {
              if (
                curr.team.id === teams.home.id &&
                currIndex <=
                  index + firstPeriodGoals.length + secondPeriodGoals.length
              ) {
                return acc + 1;
              }
              return acc;
            }, 0);
            return (
              <GoalContainer key={index}>
                <TeamLogo>
                  <GoalScorerLogo />
                </TeamLogo>
                <GoalInfoContainer>
                  <div className="scorer">{goal.scorer.name}</div>
                  <div className="assists">
                    {!goalHasAssist
                      ? 'Unassisted'
                      : `${getPlayerShortname(goal.primaryAssist.name)}${
                          goal.secondaryAssist !== null
                            ? ', ' +
                              getPlayerShortname(goal.secondaryAssist.name)
                            : ''
                        }`}
                  </div>
                  <GoalInfo
                    color={goal.team.primaryColor}
                    isDark={tinycolor(goal.team.primaryColor).isDark()}
                    isHome={isHomeTeam}
                  >
                    <div title={goal.time}>{goal.readableTime} / 3rd</div>
                    <div>
                      <span className="away">
                        {teams.away.abbr} {awayTeamScore}
                      </span>
                      ,{' '}
                      <span className="home">
                        {teams.home.abbr} {homeTeamScore}
                      </span>
                    </div>
                    {goal.goalType === 'PP' && <div>PPG</div>}
                    {goal.goalType === 'SH' && <div>SHG</div>}
                  </GoalInfo>
                </GoalInfoContainer>
              </GoalContainer>
            );
          })
        ) : (
          <GoalContainer>No Goals</GoalContainer>
        )}
      </>
      {/* Overtime (if applicable) */}
      {!!overtime && (
        <>
          <PeriodName>Overtime</PeriodName>
          {overtimeGoals.length > 0 ? (
            overtimeGoals.map((goal, index) => {
              const isHomeTeam = goal.team.id === homeTeam;

              const goalHasAssist = goal.primaryAssist !== null;
              const GoalScorerLogo = Sprites[isHomeTeam ? 'Home' : 'Away'];

              // get away team score to this point
              const awayTeamScore = scoring.reduce((acc, curr, currIndex) => {
                if (
                  curr.team.id === teams.away.id &&
                  currIndex <=
                    index +
                      firstPeriodGoals.length +
                      secondPeriodGoals.length +
                      thirdPeriodGoals.length
                ) {
                  return acc + 1;
                }
                return acc;
              }, 0);
              const homeTeamScore = scoring.reduce((acc, curr, currIndex) => {
                if (
                  curr.team.id === teams.home.id &&
                  currIndex <=
                    index +
                      firstPeriodGoals.length +
                      secondPeriodGoals.length +
                      thirdPeriodGoals.length
                ) {
                  return acc + 1;
                }
                return acc;
              }, 0);
              return (
                <GoalContainer key={index}>
                  <TeamLogo>
                    <GoalScorerLogo />
                  </TeamLogo>
                  <GoalInfoContainer>
                    <div className="scorer">{goal.scorer.name}</div>
                    <div className="assists">
                      {!goalHasAssist
                        ? 'Unassisted'
                        : `${getPlayerShortname(goal.primaryAssist.name)}${
                            goal.secondaryAssist !== null
                              ? ', ' +
                                getPlayerShortname(goal.secondaryAssist.name)
                              : ''
                          }`}
                    </div>
                    <GoalInfo
                      color={goal.team.primaryColor}
                      isDark={tinycolor(goal.team.primaryColor).isDark()}
                      isHome={isHomeTeam}
                    >
                      <div title={goal.time}>{goal.readableTime} / OT</div>
                      <div>
                        <span className="away">
                          {teams.away.abbr} {awayTeamScore}
                        </span>
                        ,{' '}
                        <span className="home">
                          {teams.home.abbr} {homeTeamScore}
                        </span>
                      </div>
                      {goal.goalType === 'PP' && <div>PPG</div>}
                      {goal.goalType === 'SH' && <div>SHG</div>}
                    </GoalInfo>
                  </GoalInfoContainer>
                </GoalContainer>
              );
            })
          ) : (
            <GoalContainer>No Goals</GoalContainer>
          )}
        </>
      )}
      {/* Shootout (if applicable) */}
      {!!shootout && (
        <>
          <PeriodName>Shootout</PeriodName>
          <GoalContainer>
            Apologies. As of right now we don&apos;t have a way to show shootout
            statistics.
          </GoalContainer>
        </>
      )}
    </TeamsPreview>
  );
};

const TeamsPreview = styled.div`
  display: flex;
  flex-direction: Column;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey100};
  margin: 5px 0;

  font-family: Montserrat, sans-serif;
`;

const PeriodName = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.grey700};
  background-color: ${({ theme }) => theme.colors.grey300};
  padding: 10px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
`;

const GoalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 25px 10px;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
  }
`;

const TeamLogo = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 0.5rem;

  & * {
    width: inherit;
    height: inherit;
  }
`;

const GoalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  overflow: hidden;
  text-overflow: ellipsis;

  & > div.scorer {
    font-size: 1.2rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  & > div.assists {
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.grey700};
  }
`;

const GoalInfo = styled.div<{
  color: string;
  isDark: boolean;
  isHome: boolean;
}>`
  border-radius: 5px;
  margin-top: 2px;
  border: 1px solid ${({ color }) => color};
  line-height: 20px;
  display: flex;
  flex-direction: row;

  & > div:nth-child(2) {
    flex: 1;
  }

  & > div:first-child,
  & > div:nth-child(3) {
    margin: 0 0.5rem;
  }

  & > div:first-child,
  & > div:nth-child(3) {
    font-size: 0.7rem;
    text-align: center;
    color: ${({ color }) => color};
  }

  & > div:nth-child(2) {
    font-size: 0.7rem;
    text-align: center;
    background-color: ${({ color }) => color};
    color: ${({ isDark }) => (isDark ? '#fff' : '#000')};

    & > span.away {
      ${({ isHome }) => (!isHome ? 'font-weight: bold;' : '')}
    }

    & > span.home {
      ${({ isHome }) => (isHome ? 'font-weight: bold;' : '')}
    }
  }
`;

export default BoxscorePeriodScoring;
