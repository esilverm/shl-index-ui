import React from 'react';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const BoxscoreFinalScores = ({ gameData, Sprites }): JSX.Element => {
  const { awayScore, homeScore, overtime, shootout } = gameData.game;
  const { periodByPeriodStats, teamStats, teams } = gameData;
  const final = `Final${shootout ? ' (SO)' : overtime ? ' (OT)' : ''}`;

  return (
    <TeamsPreview>
      <FinalHeaderRow>
        <div>{final}</div>
        <div>1ST</div>
        <div>2ND</div>
        <div>3RD</div>
        {!!overtime && <div>OT</div>}
        {!!shootout && <div>SO</div>}
        <div>T</div>
      </FinalHeaderRow>
      {/* Away */}
      <FinalTableRow>
        <TeamInfoContainer>
          <TeamLogo>
            <Sprites.Away />
          </TeamLogo>
          <TeamNameContainer>
            <TeamName>{teams.away.abbr}</TeamName>
            <TeamRecord>{teamStats.away.record}</TeamRecord>
          </TeamNameContainer>
        </TeamInfoContainer>
        {periodByPeriodStats.map((period, index) => (
          <div key={index}>{period.away.goals}</div>
        ))}
        <div>{awayScore}</div>
      </FinalTableRow>
      {/* Home */}
      <FinalTableRow>
        <TeamInfoContainer>
          <TeamLogo>
            <Sprites.Home />
          </TeamLogo>
          <TeamNameContainer>
            <TeamName>{teams.home.abbr}</TeamName>
            <TeamRecord>{teamStats.home.record}</TeamRecord>
          </TeamNameContainer>
        </TeamInfoContainer>
        {periodByPeriodStats.map((period, index) => (
          <div key={index}>{period.home.goals}</div>
        ))}
        <div>{homeScore}</div>
      </FinalTableRow>
    </TeamsPreview>
  );
};

const TeamsPreview = styled.div`
  display: flex;
  flex-direction: Column;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey100};
  margin: 5px 0;
  padding: 5px 10px;
  font-family: Montserrat, sans-serif;
`;

const FinalHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey800};
  padding: 15px 0;

  & > div:first-child {
    width: 40%;
    padding-left: 10px;
  }

  & > div:first-child,
  & > div:last-child {
    font-weight: 600;
  }

  & > div:not(:first-child) {
    flex: 1;
    font-size: 0.8rem;
    text-align: center;
  }
`;

const FinalTableRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 15px 0;

  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.grey500};
  }

  & > div:first-child {
    width: 40%;
  }

  & > div:last-child {
    font-weight: 600;
  }

  & > div:not(:first-child) {
    flex: 1;
    font-size: 0.8rem;
    text-align: center;
  }
`;

const TeamInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TeamLogo = styled.div`
  width: 40px;
  height: 40px;
`;

const TeamNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TeamName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TeamRecord = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.grey700};
`;

export default BoxscoreFinalScores;
