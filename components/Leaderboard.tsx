import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styled from 'styled-components';

import useLeaders from '../hooks/useLeaders';

interface Props {
  league: string;
  playerType: string;
  stat: string;
  seasonType: string;
  Sprites: {
    [index: string]: React.ComponentClass<any>;
  };
  position?: string;
}

const Leaderboard = ({
  league,
  playerType,
  stat,
  seasonType,
  Sprites,
  position,
}: Props): JSX.Element => {
  const { leaders, isError, isLoading } = useLeaders(
    league,
    playerType,
    stat,
    seasonType,
    position
  );

  const convertStatValue = (value: string | number) => {
    if (typeof value === 'string') return value;

    if (stat === 'shotpct') {
      return (value * 100).toFixed(2);
    } else if (stat === 'gsaa') {
      return value.toFixed(2);
    }
    return value;
  };

  const getPctOfLeader = (
    currentValue: string | number,
    leaderValue: string | number
  ) => {
    let current = parseFloat(`${convertStatValue(currentValue)}`);
    let leader = parseFloat(`${convertStatValue(leaderValue)}`);

    // For the scenario that occurs early in seasons where a goalie can have 0 GAA
    if (leader === 0) {
      current += 1;
      leader += 1;
    }

    const isDesc = current <= leader;
    return (isDesc ? current / leader : leader / current) * 100;
  };

  if (!leaders || isError || isLoading) {
    return <SkeletonLeaderboard isError={isError} />;
  }

  const renderLeaders = () => {
    const LeaderLogo = Sprites[leaders[0].team.abbr];

    return (
      <TopTen>
        <Leader>
          <StatVisualizer width={100} />
          <PlayerName>
            <span style={{ width: '20px' }}>1.</span>
            <TeamLogo large>
              <LeaderLogo />
            </TeamLogo>
            <span>{leaders[0].name}</span>
          </PlayerName>
          <span>{convertStatValue(leaders[0].stat)}</span>
        </Leader>
        {leaders.map((player, i) => {
          if (player.id === leaders[0].id) return null;
          const Logo = Sprites[player.team.abbr];

          return (
            <LeaderRow key={player.id}>
              <StatVisualizer
                width={getPctOfLeader(player.stat, leaders[0].stat)}
              />
              <PlayerName>
                <span style={{ width: '20px' }}>{`${i + 1}.`}</span>
                <TeamLogo>
                  <Logo />
                </TeamLogo>
                <span>{player.name}</span>
              </PlayerName>
              <span>{convertStatValue(player.stat)}</span>
            </LeaderRow>
          );
        })}
      </TopTen>
    );
  };

  const title = leaders[0].statName;
  return (
    <Container>
      <Title>{title}</Title>
      {renderLeaders()}
    </Container>
  );
};

const SkeletonLeaderboard = ({
  isError,
}: {
  isError: boolean;
}): JSX.Element => (
  <SkeletonTheme color="#ADB5BD" highlightColor="#CED4DA">
    {isError && (
      <Container>
        <strong>
          A technical error occurred. Please reload the page to try again.
        </strong>
      </Container>
    )}
    {!isError && (
      <Container>
        <Skeleton width={150} height={30} />
        <TopTen>
          {new Array(10).fill(0).map((_, i) => (
            <Skeleton key={i} height={30} />
          ))}
        </TopTen>
      </Container>
    )}
  </SkeletonTheme>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 250px;
  width: 450px;
  padding: 15px 25px;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;

const Title = styled.span`
  font-size: 22px;
  font-weight: 600;
  min-height: 30px;
  min-width: 50px;
`;

const LeaderRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  min-height: 30px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
  padding: 3px;

  &:hover {
    text-shadow: 0px 0px 1px black;
  }

  > span:last-child {
    font-family: Montserrat, sans-serif;
  }
`;

const StatVisualizer = styled.span<{
  width: number;
}>`
  position: absolute;
  width: ${({ width }) => width}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.grey700};
  opacity: 0.1;
  left: -1px;
`;

const PlayerName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TeamLogo = styled.div<{
  large?: boolean;
}>`
  height: ${({ large }) => (large ? '30' : '20')}px;
  width: ${({ large }) => (large ? '30' : '20')}px;
  margin-right: 5px;
`;

const TopTen = styled.div`
  display: flex;
  flex-direction: column;
`;

const Leader = styled(LeaderRow)`
  text-shadow: 0px 0px 1px black;
  font-size: 20px;
`;

export default Leaderboard;
