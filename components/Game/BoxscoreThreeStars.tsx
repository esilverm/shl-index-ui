import React from 'react';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const BoxscoreThreeStars = ({ gameData, Sprites }): JSX.Element => {
  const { star1, star2, star3 } = gameData.game;
  const { home } = gameData.teams;

  const starOneTeam = star1.team === home.id ? 'home' : 'away';
  const starOneIsGoalie = 'goalsAgainst' in star1;
  const starTwoTeam = star2.team === home.id ? 'home' : 'away';
  const starTwoIsGoalie = 'goalsAgainst' in star2;
  const starThreeTeam = star3.team === home.id ? 'home' : 'away';
  const starThreeIsGoalie = 'goalsAgainst' in star3;

  console.log(star1.teamId, home.id);
  return (
    <TeamsPreview>
      <PlayerStarContainer>
        <TeamLogo>
          {starOneTeam === 'home' ? <Sprites.Home /> : <Sprites.Away />}
        </TeamLogo>
        <PlayerStatsContainer>
          <PlayerName>{star1.name}</PlayerName>
          <PlayerStats>
            {starOneIsGoalie
              ? `SA: ${star1.shotsAgainst} SV%: ${star1.savePct.toFixed(3)}`
              : `G: ${star1.goals} A: ${star1.assists}`}
          </PlayerStats>
        </PlayerStatsContainer>
      </PlayerStarContainer>
      <PlayerStarContainer>
        <TeamLogo>
          {starTwoTeam === 'home' ? <Sprites.Home /> : <Sprites.Away />}
        </TeamLogo>
        <PlayerStatsContainer>
          <PlayerName>{star2.name}</PlayerName>
          <PlayerStats>
            {starTwoIsGoalie
              ? `SA: ${star2.shotsAgainst} SV%: ${star2.savePct.toFixed(3)}`
              : `G: ${star2.goals} A: ${star2.assists}`}
          </PlayerStats>
        </PlayerStatsContainer>
      </PlayerStarContainer>
      <PlayerStarContainer>
        <TeamLogo>
          {starThreeTeam === 'home' ? <Sprites.Home /> : <Sprites.Away />}
        </TeamLogo>
        <PlayerStatsContainer>
          <PlayerName>{star3.name}</PlayerName>
          <PlayerStats>
            {starThreeIsGoalie
              ? `SA: ${star3.shotsAgainst} SV%: ${star3.savePct.toFixed(3)}`
              : `G: ${star3.goals} A: ${star3.assists}`}
          </PlayerStats>
        </PlayerStatsContainer>
      </PlayerStarContainer>
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

const PlayerStarContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 5px;
`;

const TeamLogo = styled.div`
  width: 60px;
  height: 60px;
  margin-right: 0.5rem;

  & * {
    width: inherit;
    height: inherit;
  }
`;

const PlayerName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerStats = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.grey700};
`;

const PlayerStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

export default BoxscoreThreeStars;
