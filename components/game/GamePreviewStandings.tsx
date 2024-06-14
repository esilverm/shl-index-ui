import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { Standings, StandingsItem } from '../../pages/api/v1/standings';
import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { League, leagueNameToId } from '../../utils/leagueHelpers';
import { query } from '../../utils/query';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';
import { TeamLogo } from '../TeamLogo';

const TableCell = ({
  children,
  className,
  firstColumn = false,
  isNumeric = false,
}: {
  children?: React.ReactNode;
  className?: string;
  firstColumn?: boolean;
  isNumeric?: boolean;
}) => (
  <div
    className={classnames(
      'font-mont',
      isNumeric ? 'text-right' : !firstColumn && 'text-center',
      firstColumn ? 'w-1/3' : 'flex-1 px-1',
      className,
    )}
  >
    {children}
  </div>
);

const DivisionStandings = ({
  league,
  standings,
  teamAbbr,
}: {
  league: League;
  standings: Exclude<Standings, StandingsItem[]>[number];
  teamAbbr: string[];
}) => {
  const router = useRouter();
  return (
    <div className="w-full bg-grey100 dark:bg-grey100Dark">
      <div className="p-4 font-semibold">{standings.name} Standings</div>
      <div className="flex h-10 w-full items-center bg-grey300 font-semibold dark:bg-grey300Dark">
        <TableCell firstColumn />
        <TableCell>PTS</TableCell>
        <TableCell>GP</TableCell>
        <TableCell>W</TableCell>
        <TableCell>L</TableCell>
        <TableCell>OT</TableCell>
      </div>
      <div className="divide-y-2 divide-grey300 dark:divide-grey300Dark">
        {standings.teams.map((team) => (
          <div
            key={team.id}
            className={classnames(
              'flex h-10 w-full items-center px-2',
              teamAbbr.some((abbr) => team.abbreviation === abbr) &&
                'bg-blue700/10 dark:bg-blue700Dark/10',
            )}
          >
            <TableCell
              className="flex items-center pl-2 pr-4 font-semibold"
              firstColumn
            >
              <TeamLogo
                league={league}
                teamAbbreviation={team.abbreviation}
                className="mr-2 h-[25px] w-[25px]"
              />
              <Link
                href={{
                  pathname: '/[league]/team/[teamid]',
                  query: {
                    ...onlyIncludeSeasonAndTypeInQuery(router.query),
                    teamid: team.id,
                  },
                }}
              >
                {team.abbreviation}
              </Link>
            </TableCell>
            <TableCell isNumeric>{team.points}</TableCell>
            <TableCell isNumeric>{team.gp}</TableCell>
            <TableCell isNumeric>{team.wins}</TableCell>
            <TableCell isNumeric>{team.losses}</TableCell>
            <TableCell isNumeric>{team.OTL}</TableCell>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GamePreviewStandings = ({
  league,
  previewData,
}: {
  league: League;
  previewData: GamePreviewData | undefined;
}) => {
  const standingsType = league === 'shl' ? 'division' : 'conference';

  const { data } = useQuery<Exclude<Standings, StandingsItem[]>>({
    queryKey: [
      'standings',
      league,
      'Regular Season',
      previewData?.game.season,
      standingsType,
    ],
    queryFn: () => {
      return query(
        `api/v1/standings?league=${leagueNameToId(
          league,
        )}&display=${standingsType}&season=${previewData?.game.season}`,
      );
    },
    enabled: !!previewData,
  });

  const awayDivision = useMemo(
    () =>
      data?.find((division) =>
        division.teams.some(
          (team) => team.abbreviation === previewData?.teams.away.abbr,
        ),
      ),
    [data, previewData?.teams.away.abbr],
  );

  const homeDivision = useMemo(
    () =>
      data?.find((division) =>
        division.teams.some(
          (team) => team.abbreviation === previewData?.teams.home.abbr,
        ),
      ),
    [data, previewData?.teams.home.abbr],
  );

  const isSameDivision = awayDivision?.name === homeDivision?.name;

  if (!awayDivision || !homeDivision || !previewData) {
    return null;
  }

  return (
    <>
      <DivisionStandings
        league={league}
        standings={awayDivision}
        teamAbbr={[
          previewData.teams.away.abbr,
          ...(isSameDivision ? [previewData.teams.home.abbr] : []),
        ]}
      />
      {!isSameDivision && (
        <DivisionStandings
          league={league}
          standings={homeDivision}
          teamAbbr={[previewData.teams.home.abbr]}
        />
      )}
    </>
  );
};
