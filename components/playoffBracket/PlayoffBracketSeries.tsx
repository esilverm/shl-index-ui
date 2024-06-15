import classnames from 'classnames';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import tinycolor from 'tinycolor2';

import { PlayoffsSeries } from '../../pages/api/v1/standings/playoffs';
import { TeamInfo } from '../../pages/api/v1/teams';
import { isMainLeague, League } from '../../utils/leagueHelpers';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';
import { TeamLogo } from '../TeamLogo';

import { LEAGUE_WIN_CONDITION } from './shared';

enum SeriesWinnerState {
  AWAY = 'away',
  HOME = 'home',
  NOWINNER = 'none',
}

const TeamLine = ({
  teamInfo,
  lostSeries,
  league,
  shouldUseTeamShortName,
}: {
  teamInfo: {
    id: number;
    abbr: string;
    name: string;
    wins: number;
    color: {
      background: string;
      isDark: boolean;
    };
  };
  lostSeries: boolean;
  league: League;
  shouldUseTeamShortName?: boolean;
}) => {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: teamInfo.id !== -1 ? '/[league]/team/[id]' : router.pathname,
        query: {
          ...onlyIncludeSeasonAndTypeInQuery(router.query),
          ...(teamInfo.id !== -1 ? { id: teamInfo.id } : {}),
        },
      }}
      className={classnames(
        'flex h-[55px] w-full items-center text-lg font-semibold tracking-wider hover:opacity-80',
        lostSeries && 'opacity-50',
      )}
      style={{
        backgroundColor: teamInfo.color.background,
      }}
    >
      {teamInfo.abbr === '' ? (
        <div />
      ) : (
        <TeamLogo
          league={league}
          teamAbbreviation={teamInfo.abbr}
          className="aspect-square w-[55px] min-w-[55px] p-[5px]"
        />
      )}
      <span
        className={classnames(
          'pr-[5px]',
          !shouldUseTeamShortName &&
            'overflow-hidden text-ellipsis whitespace-nowrap',
          teamInfo.color.isDark ? 'text-grey100 dark:text-grey100TextDark' : 'text-grey900 dark:text-grey900Dark',
        )}
      >
        {shouldUseTeamShortName ? teamInfo.abbr : teamInfo.name}
      </span>
      <div className="ml-auto flex h-full w-5 items-center justify-center bg-grey900/50 px-[15px] font-mont text-2xl font-bold text-grey100 dark:bg-grey900Dark/50 dark:text-grey100TextDark">
        {teamInfo.wins !== -1 && teamInfo.wins}
      </div>
    </Link>
  );
};

export const PlayoffBracketSeries = ({
  series,
  league,
  teamData,
  shouldUseTeamShortName = false,
}: {
  series: Omit<PlayoffsSeries, 'league' | 'season'>;
  league: League;
  teamData: TeamInfo[];
  shouldUseTeamShortName?: boolean;
}) => {
  const primaryColors = useMemo(
    () => ({
      away:
        teamData.find((team) => team.id === series.team1.id)?.colors.primary ||
        '#DDD',
      home:
        teamData.find((team) => team.id === series.team2.id)?.colors.primary ||
        '#BBB',
    }),
    [series, teamData],
  );

  const awayTeamInfo = useMemo(
    () => ({
      id: series.team1.id ?? -1,
      abbr: series.team1.abbr ?? '',
      name:
        (isMainLeague(league) ? series.team1.name : series.team1.nickname) ??
        'Away Team',
      wins: series.team1.wins ?? -1,
      color: {
        background: primaryColors.away,
        isDark: tinycolor(primaryColors.away).isDark(),
      },
    }),
    [league, primaryColors.away, series.team1],
  );

  const homeTeamInfo = useMemo(
    () => ({
      id: series.team2.id ?? -1,
      abbr: series.team2.abbr ?? '',
      name:
        (isMainLeague(league) ? series.team2.name : series.team2.nickname) ??
        'Home Team',
      wins: series.team2.wins ?? -1,
      color: {
        background: primaryColors.home,
        isDark: tinycolor(primaryColors.home).isDark(),
      },
    }),
    [league, primaryColors.home, series.team2],
  );

  const seriesWinner = useMemo(() => {
    if (awayTeamInfo.wins === LEAGUE_WIN_CONDITION[league])
      return SeriesWinnerState.AWAY;
    if (homeTeamInfo.wins === LEAGUE_WIN_CONDITION[league])
      return SeriesWinnerState.HOME;
    return SeriesWinnerState.NOWINNER;
  }, [awayTeamInfo.wins, homeTeamInfo.wins, league]);

  return (
    <div
      className={classnames(
        'mb-1.5 flex flex-col items-center',
        shouldUseTeamShortName ? 'w-[160px] p-2.5' : 'w-[230px]  p-5',
      )}
    >
      <TeamLine
        league={league}
        lostSeries={seriesWinner === SeriesWinnerState.HOME}
        teamInfo={awayTeamInfo}
        shouldUseTeamShortName={shouldUseTeamShortName}
      />
      <TeamLine
        league={league}
        lostSeries={seriesWinner === SeriesWinnerState.AWAY}
        teamInfo={homeTeamInfo}
        shouldUseTeamShortName={shouldUseTeamShortName}
      />
    </div>
  );
};
