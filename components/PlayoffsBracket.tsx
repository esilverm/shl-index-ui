import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlayoffsRound, PlayoffsSerie } from '../pages/api/v1/standings/playoffs';

interface Props {
  data: Array<PlayoffsRound>;
  league: string;
}

function PlayoffsBracket({ data, league }: Props): JSX.Element {
  const [isLoadingAssets, setLoadingAssets] = useState<boolean>(true);
  const [sprites, setSprites] = useState<{
    [index: string]: React.ComponentClass<any>;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(isLoadingAssets || !data);
  }, [isLoadingAssets, data]);

  if (isLoading) return null; // TODO: Loader

  const renderSerie = (serie: PlayoffsSerie) => {
    const awayTeam = {
      id: serie.team1,
      abbr: serie.team1_Abbr,
      wins: serie.team1Wins
    };
    const homeTeam = {
      id: serie.team2,
      abbr: serie.team2_Abbr,
      wins: serie.team2Wins
    };

    const AwayLogo = sprites[awayTeam.abbr];
    const HomeLogo = sprites[homeTeam.abbr];
    let leader = 'Tied';
    let score = `${awayTeam.wins} - ${homeTeam.wins}`;
    
    if (awayTeam.wins > homeTeam.wins) {
      leader = awayTeam.wins === 4 ? `${awayTeam.abbr} wins` : `${awayTeam.abbr} leads`;
    } else if (homeTeam.wins > awayTeam.wins) {
      leader = homeTeam.wins === 4 ? `${homeTeam.abbr} wins` : `${homeTeam.abbr} leads`;
      score = `${homeTeam.wins} - ${awayTeam.wins}`;
    }

    return (
      <Series key={`${awayTeam.id}${homeTeam.id}`}>
        <SeriesTeam>
          <AwayLogo />
        </SeriesTeam>
        <SeriesScore>
          <p>{leader}</p>
          <p>{score}</p>
        </SeriesScore>
        <SeriesTeam>
          <HomeLogo />
        </SeriesTeam>
      </Series>
    );
  };
  const renderRound = (round, index) => (
    <Round key={index}>
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
  margin-right: 250px;
`;

const Series = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const SeriesTeam = styled.div`
  height: 50px;
  width: 50px;
`;

const SeriesScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
  padding: 10px 0;
`;

export default React.memo(PlayoffsBracket);
