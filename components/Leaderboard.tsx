import React from 'react';
import styled from 'styled-components';
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

  if (!leaders || isError || isLoading) return null;

  const renderLeaders = () => {
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
          <span>{leaders[0].stat}</span>
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
              <span>{player.stat}</span>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: 600;
`;

const LeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
  padding: 3px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grey200};
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
  margin-right: 10px;
`;

const TopTen = styled.div`
  display: flex;
  flex-direction: column;
`;

const Leader = styled(LeaderRow)`
  font-weight: 500;
  font-size: 18px;
`;

export default Leaderboard;
