import React from 'react';
import styled from 'styled-components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import useLeaders from '../hooks/useLeaders';

interface Props {
  league: string;
  playerType: string;
  stat: {
    id: string;
    label: string;
  };
  seasonType: string;
  Sprites: {
    [index: string]: React.ComponentClass<any>;
  };
}

const Leaderboard = ({ league, playerType, stat, seasonType, Sprites }: Props): JSX.Element => {
  const { leaders, isError, isLoading } = useLeaders(league, playerType, stat.id, seasonType);

  const convertStatValue = (value: string | number) => {
    if (typeof value === "string") return value;

    if (stat.id === 'shotpct') {
      return (value * 100).toFixed(2);
    } else if (stat.id === 'gsaa') {
      return value.toFixed(2);
    }
    return value;
  };

  if (!leaders || isError || isLoading) {
    return <SkeletonLeaderboard isError={isError} />;
  }

  const renderLeaders = () => {
    console.log(stat.label, leaders);
    const LeaderLogo = Sprites[leaders[0].team.abbr];

    return (
      <TopTen>
        <Leader>
          <PlayerName>
            <span style={{ width: '20px'}}>1.</span>
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
              <PlayerName>
                <span style={{ width: '20px'}}>{`${i+1}.`}</span>
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

  return (
    <Container>
      <Title>{stat.label}</Title>
      {renderLeaders()}
    </Container>
  );
}

const SkeletonLeaderboard = ({
  isError
}: {
  isError: boolean;
}): JSX.Element => (
  <SkeletonTheme color='#ADB5BD' highlightColor='#CED4DA'>
    {isError && (
      <Container>
        <strong>
          A technical error occurred. Please reload the page to try again.
        </strong>
      </Container>
    )}
    {!isError && 
      <Container>
        <Skeleton width={150} height={30} />
        <TopTen>
          {new Array(10).fill(0).map((_, i) => (
            <Skeleton key={i} height={30} />
          ))}
        </TopTen>
      </Container>
    }
  </SkeletonTheme>
)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 330px;
  padding: 15px 25px;
`;

const Title = styled.span`
  font-size: 20px;
  font-weight: 600;
  height: 30px;
  min-width: 50px;
`;

const LeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

const PlayerName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TeamLogo = styled.div<{
  large?: boolean;
}>`
  height: ${({ large }) => large ? '30' : '20'}px;
  width: ${({ large }) => large ? '30' : '20'}px;
  margin-right: 5px;
`;

const TopTen = styled.div`
  display: flex;
  flex-direction: column;
`;

const Leader = styled(LeaderRow)`
  text-shadow: 0px 0px 1px black;
  font-size: 18px;
`;

export default Leaderboard;
