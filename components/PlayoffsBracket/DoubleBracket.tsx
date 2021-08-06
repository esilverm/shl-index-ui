import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import tinycolor from 'tinycolor2';

import {
  PlayoffsRound,
  PlayoffsSeries,
} from '../../pages/api/v1/standings/playoffs';
import Link from '../LinkWithSeason';

import { SeriesScore } from './SingleBracket';
import PlayoffsBracketSkeleton from './Skeleton';

interface Props {
  data: Array<PlayoffsRound>;
  league: string;
}

const LEAGUE_WIN_CONDITION = {
  shl: 4,
  smjhl: 4,
  iihf: 1,
  wjc: 1,
};

const CONFERENCE = {
  EASTERN: 0,
  WESTERN: 1,
  MIXED: -1
};

const getSeriesByConference = (round, bracketConference) => round.filter(series =>
  series.team1.conference === series.team2.conference &&
  series.team1.conference === bracketConference
);

const sortByDivision = round => round.sort((a, b) =>
  a.team1.division + a.team2.division > b.team1.division + b.team2.division ? 1 : -1
);

function DoubleBracket({ data, league }: Props): JSX.Element {
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
        `../../public/team_logos/${league.toUpperCase()}/`
      );

      setSprites(() => s);
      setLoadingAssets(() => false);
    })();
  }, []);

  useEffect(() => {
    setIsLoading(isLoadingAssets || !teamData);
  }, [isLoadingAssets, teamData]);

  const lastRoundInData = useCallback(() => data ? data[data.length - 1] : [], [data]);

  const hasFinalsRoundData = useCallback(() => {
    const lastRound = lastRoundInData();
    const isSingleSeries = lastRound.length === 1;
    const hasMixedConferences = lastRound[0].team1.conference !== lastRound[0].team2.conference;

    return isSingleSeries && hasMixedConferences;
  }, [lastRoundInData]);

  if (teamError || isLoading || !data)
    return <PlayoffsBracketSkeleton isError={teamError} />;

  const renderSeries = (series: Omit<PlayoffsSeries, 'league' | 'season'>) => {
    const isInternationalLeague = league === 'iihf' || league === 'wjc';
    const primaryColors = {
      away:
        teamData?.find((team) => team.id === series.team1.id)?.colors.primary ||
        '#DDD',
      home:
        teamData?.find((team) => team.id === series.team2.id)?.colors.primary ||
        '#BBB',
    };
    const awayTeam = {
      id: series.team1.id >= 0 ? series.team1.id : -1,
      abbr: series.team1.abbr ?? '',
      name: isInternationalLeague
        ? series.team1.nickname ?? 'Away Team'
        : series.team1.name ?? 'Away Team',
      wins: series.team1.wins ?? '',
      color: {
        background: primaryColors.away,
        isDark: tinycolor(primaryColors.away).isDark(),
      },
    };
    const homeTeam = {
      id: series.team2.id >= 0 ? series.team2.id : -1,
      abbr: series.team2.abbr ?? '',
      name: isInternationalLeague
        ? series.team2.nickname ?? 'Home Team'
        : series.team2.name ?? 'Home Team',
      wins: series.team2.wins ?? '',
      color: {
        background: primaryColors.home,
        isDark: tinycolor(primaryColors.home).isDark(),
      },
    };

    const isAwayTeamPlaceholder = awayTeam.id === -1;
    const isHomeTeamPlaceholder = homeTeam.id === -1;
    const hasAwayTeamWon = awayTeam.wins === LEAGUE_WIN_CONDITION[league];
    const hasHomeTeamWon = homeTeam.wins === LEAGUE_WIN_CONDITION[league];
    const temp = () => <div></div>;
    const AwayLogo = sprites[awayTeam.abbr] ?? temp;
    const HomeLogo = sprites[homeTeam.abbr] ?? temp;

    return (
      <Series key={`${awayTeam.id}${homeTeam.id}`}>
        <Link
          href="/[league]/team/[id]"
          as={`/${league}/team/${awayTeam.id}`}
          passHref
          disabled={isAwayTeamPlaceholder}
        >
          <SeriesTeam
            color={awayTeam.color.background}
            isDark={awayTeam.color.isDark}
            lost={hasHomeTeamWon}
            disabled={isAwayTeamPlaceholder}
          >
            <AwayLogo />
            <span>{awayTeam.abbr}</span>
            <SeriesScore>{awayTeam.wins}</SeriesScore>
          </SeriesTeam>
        </Link>
        <Link
          href="/[league]/team/[id]"
          as={`/${league}/team/${homeTeam.id}`}
          passHref
          disabled={isHomeTeamPlaceholder}
        >
          <SeriesTeam
            color={homeTeam.color.background}
            isDark={homeTeam.color.isDark}
            lost={hasAwayTeamWon}
            disabled={isHomeTeamPlaceholder}
          >
            <HomeLogo />
            <span>{homeTeam.abbr}</span>
            <SeriesScore>{homeTeam.wins}</SeriesScore>
          </SeriesTeam>
        </Link>
      </Series>
    );
  };

  const renderRound = (round, conference, index) => (
    <Round key={index} conference={conference}>
      <h2>{round.length === 1 && conference === CONFERENCE.MIXED ? 'Finals' : `Round ${index + 1}`}</h2>
      {round.map((series) => renderSeries(series))}
    </Round>
  );

  const renderPlaceholderRound = (numSeries, previousRound, conference, index) => {
    const series = [];

    for (let i = 0; i <= numSeries; i+=2) {
      // If a team from the previous round has reached the win condition show them in the next round instead of a gray placeholder
      const previousSeries = [previousRound[i], previousRound[i+1]];
      const previousWinners = previousSeries.map(prevSeries => {
        if (!prevSeries) return {};
        let winningTeam = {};

        if (prevSeries.team1.wins === LEAGUE_WIN_CONDITION[league]) {
          winningTeam = prevSeries.team1;
        } else if (prevSeries.team2.wins === LEAGUE_WIN_CONDITION[league]) {
          winningTeam = prevSeries.team2;
        }

        return {
          ...winningTeam,
          wins: undefined // Don't show any wins as placeholder series hasn't started yet
        };
      });

      series.push(
        renderSeries({
          team1: previousWinners[0],
          team2: previousWinners[1]
        })
      );
    }

    return (
      <Round key={index} conference={conference}>
        <h2>{numSeries === 1 && conference === CONFERENCE.MIXED ? 'Finals' : `Round ${index + 1}`}</h2>
        {series}
      </Round>
    );
  };

  const renderBracket = (bracketConference) => {
    const totalBracketRounds = 3;
    const seriesPerRound = [4, 2, 1];
    const rounds = [];

    for (let i = 0; i < totalBracketRounds; i++) {
      if (i < data.length) { // If we have data from FHM for the given round
        const conferenceRound = getSeriesByConference(data[i], bracketConference);
        const sortedRound = sortByDivision(conferenceRound);
        rounds.push(renderRound(sortedRound, bracketConference, i));
      } else {
        const previousRound = data[i-1] ? getSeriesByConference(data[i-1], bracketConference) : [];
        const sortedRound = sortByDivision(previousRound);
        rounds.push(renderPlaceholderRound(seriesPerRound[i], sortedRound, bracketConference, i));
      }
    }

    return rounds;
  };

  const hasFinalsRound = hasFinalsRoundData();

  return (
    <Container>
      <Bracket conference={CONFERENCE.WESTERN}>{renderBracket(CONFERENCE.WESTERN)}</Bracket>
      {!hasFinalsRound && renderPlaceholderRound(1, [], CONFERENCE.MIXED, 3)}
      {hasFinalsRound && renderRound(lastRoundInData(), CONFERENCE.MIXED, 3)}
      <Bracket conference={CONFERENCE.EASTERN}>{renderBracket(CONFERENCE.EASTERN)}</Bracket>
    </Container>
  );
}

const Container = styled.div`
  width: 95%;
  height: 100%;
  margin: auto;
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Bracket = styled.div<{
  conference?: number;
}>`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row${({ conference }) => conference === CONFERENCE.EASTERN && '-reverse'};
  align-items: center;
`;

const Round = styled.div<{
  conference?: number;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
  margin${({ conference }) => conference === -1 ? '' : conference === CONFERENCE.EASTERN ? '-left' : '-right'}: 20px;

  h2 {
    margin-bottom: 10px;
  }
`;

const Series = styled.div`
  display: flex;
  flex-direction: column;
  width: 160px;
  align-items: center;
  margin-bottom: 5px;
  padding: 10px;
`;

const SeriesTeam = styled.div<{
  color: string;
  isDark: boolean;
  lost: boolean;
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  height: 55px;
  width: 160px;
  background-color: ${({ color }) => color};
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
  letter-spacing: 0.05rem;
  font-size: 18px;
  font-weight: 600;
  ${({ lost }) => lost && 'opacity: 0.5;'}

  svg {
    width: 55px;
    padding: 5px;
  }

  span {
    padding-right: 5px;
    color: ${({ isDark, theme }) =>
      isDark ? theme.colors.grey100 : theme.colors.grey900};
  }

  &:hover {
    background-color: ${({ color, disabled }) =>
      disabled ? color : tinycolor(color).setAlpha(0.85).toRgbString()};
  }
`;

export default React.memo(DoubleBracket);
