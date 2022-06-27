import React from 'react';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const BoxscorePeriodPenalties = ({ gameData }) => {
  const { penalties } = gameData.boxscore;
  const { overtime } = gameData.game;

  const firstPeriodPenalties = penalties.filter(
    (penalty) => penalty.period === 1
  );
  const secondPeriodPenalties = penalties.filter(
    (penalty) => penalty.period === 2
  );
  const thirdPeriodPenalties = penalties.filter(
    (penalty) => penalty.period === 3
  );
  const overtimePenalties = penalties.filter((penalty) => penalty.period === 0);

  return (
    <TeamsPreview>
      {/* 1st */}
      <>
        <PeriodName>
          <div>1st</div>
          <div>Team</div>
          <div>Penalty</div>
        </PeriodName>
        {firstPeriodPenalties.length > 0 ? (
          firstPeriodPenalties.map((penalty, index) => (
            <PenaltyContainer key={index} color={penalty.team.primaryColor}>
              <div>{penalty.readableTime}</div>
              <div>{penalty.team.abbr}</div>
              <div>
                {penalty.reason} on {penalty.player}
              </div>
            </PenaltyContainer>
          ))
        ) : (
          <PenaltyContainer>No Penalties</PenaltyContainer>
        )}
      </>
      {/* 2nd */}
      <>
        <PeriodName>
          <div>2st</div>
          <div>Team</div>
          <div>Penalty</div>
        </PeriodName>
        {secondPeriodPenalties.length > 0 ? (
          secondPeriodPenalties.map((penalty, index) => (
            <PenaltyContainer key={index} color={penalty.team.primaryColor}>
              <div>{penalty.readableTime}</div>
              <div>{penalty.team.abbr}</div>
              <div>
                {penalty.reason} on {penalty.player}
              </div>
            </PenaltyContainer>
          ))
        ) : (
          <PenaltyContainer>No Penalties</PenaltyContainer>
        )}
      </>
      {/* 3rd */}
      <>
        <PeriodName>
          <div>3rd</div>
          <div>Team</div>
          <div>Penalty</div>
        </PeriodName>
        {thirdPeriodPenalties.length > 0 ? (
          thirdPeriodPenalties.map((penalty, index) => (
            <PenaltyContainer key={index} color={penalty.team.primaryColor}>
              <div>{penalty.readableTime}</div>
              <div>{penalty.team.abbr}</div>
              <div>
                {penalty.reason} on {penalty.player}
              </div>
            </PenaltyContainer>
          ))
        ) : (
          <PenaltyContainer>No Penalties</PenaltyContainer>
        )}
      </>
      {/* overtime */}
      {!!overtime && (
        <>
          <PeriodName>
            <div>OT</div>
            <div>Team</div>
            <div>Penalty</div>
          </PeriodName>
          {overtimePenalties.length > 0 ? (
            overtimePenalties.map((penalty, index) => (
              <PenaltyContainer key={index} color={penalty.team.primaryColor}>
                <div>{penalty.readableTime}</div>
                <div>{penalty.team.abbr}</div>
                <div>
                  {penalty.reason} on {penalty.player}
                </div>
              </PenaltyContainer>
            ))
          ) : (
            <PenaltyContainer>No Penalties</PenaltyContainer>
          )}
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
  display: flex;
  flex-direction: row;

  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.grey700};
  background-color: ${({ theme }) => theme.colors.grey300};
  padding: 10px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};

  & > div:first-child,
  & > div:nth-child(2) {
    width: 20%;
  }

  & > div:last-child {
    flex: 1;
  }
`;

const PenaltyContainer = styled.div<{ color?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 25px 10px;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
  }

  & > div:nth-child(2) {
    color: ${({ color }) => color};
  }

  & > div:first-child,
  & > div:nth-child(2) {
    width: 20%;
  }

  & > div:last-child {
    flex: 1;
  }
`;

export default BoxscorePeriodPenalties;
