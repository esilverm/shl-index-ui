import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import tinycolor from 'tinycolor2';
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
    const isInternationalLeague = league === "iihf" || league === "wjc";
    const primaryColors = {
      away: teamData.find(team => team.id === serie.team1).colors.primary || '#FFFFFF',
      home: teamData.find(team => team.id === serie.team2).colors.primary || '#FFFFFF'
    };
    const awayTeam = {
      id: serie.team1,
      abbr: serie.team1_Abbr,
      name: isInternationalLeague ? serie.team1_Nickname : serie.team1_Name,
      wins: serie.team1Wins,
      color: {
        background: primaryColors.away,
        isDark: tinycolor(primaryColors.away).isDark()
      }
    };
    const homeTeam = {
      id: serie.team2,
      abbr: serie.team2_Abbr,
      name: isInternationalLeague ? serie.team2_Nickname : serie.team2_Name,
      wins: serie.team2Wins,
      color: {
        background: primaryColors.home,
        isDark: tinycolor(primaryColors.home).isDark()
      }
    };
    const hasAwayTeamWon = awayTeam.wins === LEAGUE_WIN_CONDITION[league];
    const hasHomeTeamWon = homeTeam.wins === LEAGUE_WIN_CONDITION[league];
    const AwayLogo = sprites[awayTeam.abbr];
    const HomeLogo = sprites[homeTeam.abbr];

    return (
      <Series key={`${awayTeam.id}${homeTeam.id}`}>
        <SeriesTeam color={awayTeam.color.background} isDark={awayTeam.color.isDark} lost={hasHomeTeamWon}>
          <AwayLogo />
          <span>{awayTeam.name}</span>
          <SeriesScore>
            {awayTeam.wins}
          </SeriesScore>
        </SeriesTeam>
        <SeriesTeam color={homeTeam.color.background} isDark={homeTeam.color.isDark} lost={hasAwayTeamWon}>
          <HomeLogo />
          <span>{homeTeam.name}</span>
          <SeriesScore>
            {homeTeam.wins}
          </SeriesScore>
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
  width: 270px;

  h2 {
    margin-bottom: 10px;
  }
`;

const Series = styled.div`
  display: flex;
  flex-direction: column;
  width: 130px;
  align-items: center;
  margin-bottom: 5px;
  padding: 20px;
`;
const SeriesTeam = styled.div<{
  color: string;
  isDark: boolean;
  lost: boolean;
}>`
  display: flex;
  align-items: center;
  height: 55px;
  width: 230px;
  background-color: ${props => props.color};
  letter-spacing: 0.05rem;
  font-size: 18px;
  font-weight: 600;
  ${props => props.lost && 'opacity: 0.5;'}

  svg {
    width: 55px;
    padding: 5px;
  }

  span {
    padding-right: 5px;
    color: ${({ isDark, theme }) => isDark ? theme.colors.grey100 : theme.colors.grey900};
  }
`;

const SeriesScore = styled.div`
  background-color: ${({ theme }) => theme.colors.grey900}80;
  color: ${({ theme }) => theme.colors.grey100};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 20px;
  padding: 0 15px;
  font-family: Montserrat, Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: 25px;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  margin-left: auto;
`;

export default React.memo(PlayoffsBracket);
