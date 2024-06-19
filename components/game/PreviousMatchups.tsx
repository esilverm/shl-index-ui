import { Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { useRouter } from 'next/router';

import { Game } from '../../pages/api/v1/schedule';
import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { League } from '../../utils/leagueHelpers';
import { query } from '../../utils/query';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';
import { TeamLogo } from '../TeamLogo';

export const PreviousMatchups = ({
  league,
  previewData,
}: {
  league: League;
  previewData: GamePreviewData | undefined;
}) => {
  const router = useRouter();
  const { data } = useQuery<Game[]>({
    queryKey: [
      `previousMatchups`,
      previewData?.game.league,
      previewData?.game.season,
      previewData?.game.type,
      previewData?.game.awayTeam,
      previewData?.game.homeTeam,
    ],
    queryFn: () =>
      query(
        `api/v2/schedule/game/previousMatchups?league=${previewData?.game.league}&season=${previewData?.game.season}&type=${previewData?.game.type}&away=${previewData?.game.awayTeam}&home=${previewData?.game.homeTeam}`,
      ),
    enabled: !!previewData,
  });

  if (!previewData || !data) {
    return (
      <div className="flex h-fit w-full flex-col items-center justify-center bg-grey100 p-4 dark:bg-backgroundGrey100">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-grey100 dark:bg-backgroundGrey100">
      <div className="border-b-2 border-b-grey300 py-2.5 px-4 font-semibold dark:border-b-globalBorderGrey">
        {previewData.game.type} Series
      </div>
      {data.length === 0 ? (
        <div className="flex flex-col bg-grey100 py-2.5 px-4 dark:bg-backgroundGrey100">
          No previous games played
        </div>
      ) : (
        <div className="divide-y-2 divide-grey300 dark:divide-white">
          {data.map((matchup) => {
            const awayTeamInfo =
              matchup.awayTeam === previewData.game.awayTeam
                ? previewData.teams.away
                : previewData.teams.home;

            const homeTeamInfo =
              matchup.homeTeam === previewData.game.homeTeam
                ? previewData.teams.home
                : previewData.teams.away;

            return (
              <Link
                key={matchup.slug}
                href={{
                  pathname: `/[league]/${previewData.game.season}/game/[gameid]`,
                  query: {
                    ...onlyIncludeSeasonAndTypeInQuery(router.query),
                    gameid: matchup.slug,
                  },
                }}
                className={classnames(
                  'flex flex-col bg-grey100 py-2.5 px-4 hover:brightness-75 dark:bg-backgroundGrey100',
                )}
              >
                <span className="mb-1.5 font-mont text-sm font-medium">
                  {matchup.date} {matchup.played ? ' • Final' : ' • Not Played'}
                </span>
                <div className="mb-1.5 flex items-center justify-between font-mont text-sm font-medium">
                  <div className="flex items-center">
                    <TeamLogo
                      league={league}
                      teamAbbreviation={awayTeamInfo.abbr}
                      className="mr-2 h-[25px] w-[25px]"
                    />
                    {awayTeamInfo.nickname}
                  </div>
                  <span
                    className={classnames(
                      'text-base',
                      matchup.awayScore < matchup.homeScore && 'text-grey500 dark:text-boxscoreTextLightGrey',
                      !matchup.played && 'hidden',
                    )}
                  >
                    {matchup.awayScore}
                  </span>
                </div>
                <div className="mb-1.5 flex items-center justify-between font-mont text-sm font-medium">
                  <div className="flex items-center">
                    <TeamLogo
                      league={league}
                      teamAbbreviation={homeTeamInfo.abbr}
                      className="mr-2 h-[25px] w-[25px]"
                    />
                    {homeTeamInfo.nickname}
                  </div>
                  <span
                    className={classnames(
                      'text-base',
                      matchup.homeScore < matchup.awayScore && 'text-grey500 dark:text-boxscoreTextLightGrey',
                      !matchup.played && 'hidden',
                    )}
                  >
                    {matchup.homeScore}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
