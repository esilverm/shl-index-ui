import React from 'react';
import styled from 'styled-components';

const PERIOD_NAMES = [1, 2, 3, 'OT'];
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const BoxscorePeriodShots = ({ gameData }) => {
  const { periodByPeriodStats, teams } = gameData;

  return (
    <TeamsPreview>
      <TableHeader>
        <div>Period</div>
        <div>{teams.away.abbr}</div>
        <div>{teams.home.abbr}</div>
      </TableHeader>
      {periodByPeriodStats.map((period, index) => (
        <ShotsContainer key={index}>
          <div>{PERIOD_NAMES[index]}</div>
          <div>{period.away.shots}</div>
          <div>{period.home.shots}</div>
        </ShotsContainer>
      ))}
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

const TableHeader = styled.div`
  display: flex;
  flex-direction: row;

  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.grey700};
  background-color: ${({ theme }) => theme.colors.grey300};
  padding: 10px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};

  & > div:first-child {
    width: 50%;
  }

  & > div:nth-child(2),
  & > div:last-child {
    flex: 1;
  }
`;

const ShotsContainer = styled.div<{ color?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 25px 10px;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
  }

  & > div:first-child {
    width: 50%;
  }

  & > div:nth-child(2),
  & > div:last-child {
    flex: 1;
  }
`;

export default BoxscorePeriodShots;
