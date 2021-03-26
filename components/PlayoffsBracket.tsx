import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { PlayoffsRound, PlayoffsSerie } from '../pages/api/v1/standings/playoffs';

interface Props {
  data: Array<PlayoffsRound>;
  league: string;
}

const LEAGUE_WIN_CONDITION = {
  shl: 4,
  smjhl: 4,
  iihf: 1,
  wjc: 1
};

function PlayoffsBracket({ data, league }: Props): JSX.Element {
  const [isLoadingAssets, setLoadingAssets] = useState<boolean>(true);
  const [sprites, setSprites] = useState<{
    [index: string]: React.ComponentClass<any>;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const { data: teamData, error: teamError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/teams?league=${[
      'shl',
      'smjhl',
      'iihf',
      'wjc',
    ].indexOf(league)}`
  );

  useEffect(() => {
    // Dynamically import svg icons based on the league chosen
    (async () => {
      const { default: s } = await import(
        `../public/team_logos/${league.toUpperCase()}/`
      );

      setSprites(() => s);
      setLoadingAssets(() => false);
    })();
  }, []);

  useEffect(() => {
    setIsLoading(isLoadingAssets || !data || !teamData);
  }, [isLoadingAssets, data, teamData]);

  if (teamError) return <div>{teamError}</div>; // TODO: Pretty error
  if (isLoading) return null; // TODO: Loader

  const renderSerie = (serie: PlayoffsSerie) => {
    const awayTeam = {
      id: serie.team1,
      abbr: serie.team1_Abbr,
      wins: serie.team1Wins,
      color: teamData.find(team => team.id === serie.team1).colors.primary || '#FFFFFF'
    };
    const homeTeam = {
      id: serie.team2,
      abbr: serie.team2_Abbr,
      wins: serie.team2Wins,
      color: teamData.find(team => team.id === serie.team2).colors.primary || '#FFFFFF'
    };
    const hasAwayTeamWon = awayTeam.wins === LEAGUE_WIN_CONDITION[league];
    const hasHomeTeamWon = homeTeam.wins === LEAGUE_WIN_CONDITION[league];
    const AwayLogo = sprites[awayTeam.abbr];
    const HomeLogo = sprites[homeTeam.abbr];
    let leader = 'Tied';
    let score = `${awayTeam.wins} - ${homeTeam.wins}`;

    if (awayTeam.wins > homeTeam.wins) {
      leader = awayTeam.wins === LEAGUE_WIN_CONDITION[league] ? `${awayTeam.abbr} wins` : `${awayTeam.abbr} leads`;
    } else if (homeTeam.wins > awayTeam.wins) {
      leader = homeTeam.wins === LEAGUE_WIN_CONDITION[league] ? `${homeTeam.abbr} wins` : `${homeTeam.abbr} leads`;
      score = `${homeTeam.wins} - ${awayTeam.wins}`;
    }

    return (
      <Series key={`${awayTeam.id}${homeTeam.id}`}>
        <SeriesTeam color={awayTeam.color} lost={hasHomeTeamWon}>
          <AwayLogo />
        </SeriesTeam>
        <SeriesScore>
          <p>{leader}</p>
          <p>{score}</p>
        </SeriesScore>
        <SeriesTeam color={homeTeam.color} lost={hasAwayTeamWon}>
          <HomeLogo />
        </SeriesTeam>
      </Series>
    );
  };
  const renderRound = (round, index) => (
    <Round key={index}>
      <h2>{`Round ${index + 1}`}</h2>
      {round.map(serie => renderSerie(serie))}
    </Round>
  );
  const renderBracket = () => data.map((round, i) => renderRound(round, i));

  return (
    <Container>
      <Bracket>
        {renderBracket()}
      </Bracket>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 25px;
  width: 95%;
`;

const Bracket = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 3%;
`;

const Round = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;

  h2 {
    margin-bottom: 10px;
  }
`;

const Series = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const SeriesTeam = styled.div<{
  color: string;
  lost: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65px;
  width: 65px;
  background-color: ${props => props.color};
  border-radius: 15%;
  padding: 5px;
  ${props => props.lost && 'opacity: 0.4;'}
`;

const SeriesScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
  padding: 10px 0;
`;

export default React.memo(PlayoffsBracket);
