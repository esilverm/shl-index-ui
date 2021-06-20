import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useLeaders, { PlayerWithStat } from '../hooks/useLeaders';

interface Props {
  league: string;
  playerType: string;
  stat: {
    id: string;
    label: string;
  };
  seasonType: string;
}

const Leaderboard = ({ league, playerType, stat, seasonType }: Props): JSX.Element => {
  const [leader, setLeader] = useState<PlayerWithStat>();
  const { leaders, isError, isLoading } = useLeaders(league, playerType, stat.id, seasonType);

  useEffect(() => {
    if (!leaders) return;
    setLeader(leaders[0]);
  }, [leaders]);

  if (!leaders || !leader || isError || isLoading) return null;

  const renderLeaders = () => (
    <StatsBlock>
      <Leader>
        {leader.name}
      </Leader>
      <TopTen>
        {leaders.map(player => (
          <div key={player.id}>
            {player.name}
          </div>
        ))}
      </TopTen>
    </StatsBlock>
  );

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
`;

const Title = styled.span`
  font-weight: 600;
`;

const StatsBlock = styled.div`
  display: flex;
  flex-direction: row;
`;

const Leader = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopTen = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Leaderboard;
