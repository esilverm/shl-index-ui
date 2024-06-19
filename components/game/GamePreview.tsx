import { Skeleton, SkeletonCircle } from '@chakra-ui/react';
import classnames from 'classnames';
import { useRouter } from 'next/router';

import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { League } from '../../utils/leagueHelpers';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';
import { TeamLogo } from '../TeamLogo';

export const GamePreview = ({
  league,
  previewData,
}: {
  league: League;
  previewData: GamePreviewData | undefined;
}) => {
  const router = useRouter();

  const final = `Final${
    previewData?.game.shootout
      ? ' (SO)'
      : previewData?.game.overtime
      ? ' (OT)'
      : ''
  }`;

  return (
    <div className="flex h-fit w-full flex-col bg-grey100 p-4 pt-0 dark:bg-backgroundGrey100">
      <div className="mb-2.5 flex border-b-4 border-b-grey300 py-2.5 font-mont text-sm font-semibold dark:border-b-globalBorderGrey">
        <Skeleton isLoaded={!!previewData}>
          <span className="text-sm">{previewData?.game.date}</span>
        </Skeleton>
        {!!previewData?.game.played && <div className="ml-auto">{final}</div>}
      </div>
      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex w-full items-center justify-between md:w-[45%]">
          <SkeletonCircle
            isLoaded={!!previewData}
            width={50}
            height={50}
            className="mr-2.5"
          >
            <TeamLogo
              league={league}
              teamAbbreviation={previewData?.teams.away.abbr}
              className="aspect-square w-[50px]"
            />
          </SkeletonCircle>
          <div className="ml-2.5 flex flex-1 flex-col md:ml-0">
            <Skeleton isLoaded={!!previewData}>
              <Link
                href={{
                  pathname: '/[league]/team/[teamid]',
                  query: {
                    ...onlyIncludeSeasonAndTypeInQuery(router.query),
                    teamid: previewData?.game.awayTeam,
                  },
                }}
                className="font-semibold"
              >
                {previewData?.teams.away.name}{' '}
                {previewData?.teams.away.nickname}
              </Link>
            </Skeleton>
            <Skeleton isLoaded={!!previewData}>
              <span className="font-mont text-sm text-grey600 dark:text-boxscoreTextLightGrey">
                {previewData?.teamStats.away.record}
              </span>
            </Skeleton>
          </div>

          {!!previewData?.game.played && (
            <div
              className={classnames(
                'font-mont text-4xl font-semibold',
                previewData?.game.awayScore < previewData?.game.homeScore &&
                  'text-grey500 dark:text-boxscoreTextLightGrey',
              )}
            >
              {previewData?.game.awayScore}
            </div>
          )}
        </div>
        <div className="flex w-full items-center justify-between md:w-[45%]">
          <SkeletonCircle
            isLoaded={!!previewData}
            className="mr-2.5 md:order-last md:ml-2.5 md:mr-0"
            width={50}
            height={50}
          >
            <TeamLogo
              league={league}
              teamAbbreviation={previewData?.teams.home.abbr}
              className="aspect-square w-[50px]"
            />
          </SkeletonCircle>
          <div className="ml-2.5 flex flex-1 flex-col md:ml-0 md:text-right">
            <Skeleton isLoaded={!!previewData}>
              <Link
                href={{
                  pathname: '/[league]/team/[teamid]',
                  query: {
                    ...onlyIncludeSeasonAndTypeInQuery(router.query),
                    teamid: previewData?.game.homeTeam,
                  },
                }}
                className="font-semibold"
              >
                {previewData?.teams.home.name}{' '}
                {previewData?.teams.home.nickname}
              </Link>
            </Skeleton>
            <Skeleton isLoaded={!!previewData}>
              <span className="font-mont text-sm text-grey600 dark:text-boxscoreTextLightGrey">
                {previewData?.teamStats.home.record}
              </span>
            </Skeleton>
          </div>
          {!!previewData?.game.played && (
            <div
              className={classnames(
                'font-mont text-4xl font-semibold md:order-first',
                previewData?.game.homeScore < previewData?.game.awayScore &&
                  'text-grey500 dark:text-boxscoreTextLightGrey',
              )}
            >
              {previewData?.game.homeScore}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
