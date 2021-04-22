import React from 'react';
import styled from 'styled-components';
import { Matchup } from '../../../pages/api/v1/schedule/game/[gameId]';
import { ComparisonHeader, SectionTitle, TeamLogoSmall } from '../common';

interface Props {
  gameData: Matchup;
  Sprites: {
    [index: string]: React.ComponentClass<any>;
  };
}

const SkaterComparison = ({ gameData, Sprites }: Props): JSX.Element => {
  const defaultStatLeaders = {
    away: {
      player: '',
      value: -99
    },
    home: {
      player: '',
      value: -99
    }
  };
  // Using JSON because the spread and Object.assign operators copied the object with its reference
  const teamLeaders = {
    points: {
      label: 'Points',
      ...JSON.parse(JSON.stringify(defaultStatLeaders))
    },
    goals: {
      label: 'Goals',
      ...JSON.parse(JSON.stringify(defaultStatLeaders))
    },
    assists: {
      label: 'Assists',
      ...JSON.parse(JSON.stringify(defaultStatLeaders))
    },
    plusMinus: {
      label: '+/-',
      ...JSON.parse(JSON.stringify(defaultStatLeaders))
    }
  };

  Object.keys(gameData.skaterStats).forEach((team) => {
    gameData.skaterStats[team].forEach((skater) => {
      const points = skater.goals + skater.assists;
      Object.keys(teamLeaders).forEach((stat) => {
        const skaterValue = stat === 'points' ? points : skater[stat];
        if (skaterValue > teamLeaders[stat][team].value) {
          teamLeaders[stat][team].player = skater.name;
          teamLeaders[stat][team].value = skaterValue;
        }
      });
    });
  });

  return (
    <SkaterComparisonContainer>
      <ComparisonHeader>
        <TeamLogoSmall>
          <Sprites.Away />
        </TeamLogoSmall>
        <SectionTitle>
          Players To Watch
        </SectionTitle>
        <TeamLogoSmall>
          <Sprites.Home />
        </TeamLogoSmall>
      </ComparisonHeader>
      <SkaterStats>
        {Object.keys(teamLeaders).map((stat) => (
          <StatComparison key={stat}>
            <TeamLeader>
              <LeaderSkater>{teamLeaders[stat].away.player}</LeaderSkater>
              <LeaderValue gray={teamLeaders[stat].away.value < teamLeaders[stat].home.value}>{teamLeaders[stat].away.value}</LeaderValue>
            </TeamLeader>
            <LeaderLabel>
              {teamLeaders[stat].label}
            </LeaderLabel>
            <TeamLeader home>
              <LeaderValue gray={teamLeaders[stat].home.value < teamLeaders[stat].away.value}>{teamLeaders[stat].home.value}</LeaderValue>
              <LeaderSkater>{teamLeaders[stat].home.player}</LeaderSkater>
            </TeamLeader>
          </StatComparison>
        ))}
      </SkaterStats>
    </SkaterComparisonContainer>
  );
};

const SkaterComparisonContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 15px;
  margin-top: 10px;
`;

const SkaterStats = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StatComparison = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  align-items: center;
`;

const TeamLeader = styled.div<{
  home?: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  text-align: ${({ home }) => home ? 'right' : 'left'};
  margin-${({ home }) => home ? 'left' : 'right'}: 10px;
`;

const LeaderSkater = styled.span`
  font-weight: 600;
  word-break: break-word;

  @media screen and (max-width: 900px) {
    font-size: 14px;
  }
`;

const LeaderValue = styled.span<{
  gray?: boolean;
}>`
  font-size: 32px;
  font-weight: 700;
  font-family: Montserrat, sans-serif;
  ${({ gray, theme }) => gray && `color: ${theme.colors.grey500};`}

  @media screen and (max-width: 900px) {
    font-size: 22px;
  }
`;

const LeaderLabel = styled.span`
  width: 75px;
  font-size: 14px;
  text-align: center;
`;

export default SkaterComparison;
