import { Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { useSeason } from '../../hooks/useSeason';
import { useSeasonType } from '../../hooks/useSeasonType';
import { League, leagueNameToId } from '../../utils/leagueHelpers';
import { query } from '../../utils/query';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { seasonTypeToApiFriendlyParam } from '../../utils/seasonTypeHelpers';
import { Link } from '../common/Link';
import { TeamLogo } from '../TeamLogo';

import {
  GoalieLeaderboardStats,
  LeaderboardPlayer,
  LeaderboardTypes,
  SkaterLeaderboardStats,
} from './shared';

type LeaderboardType =
  | {
      playerType: Exclude<LeaderboardTypes, 'Goalies'>;
      stat: SkaterLeaderboardStats;
    }
  | {
      playerType: Extract<LeaderboardTypes, 'Goalies'>;
      stat: GoalieLeaderboardStats;
    };

export const Leaderboard = ({
  league,
  leaderboardType,
}: {
  league: League;
  leaderboardType: LeaderboardType;
}) => {
  const { season } = useSeason();
  const { type } = useSeasonType();
  const router = useRouter();

  const position = useMemo(() => {
    if (
      leaderboardType.playerType !== 'Forwards' &&
      leaderboardType.playerType !== 'Defensemen'
    ) {
      return '';
    }
    return leaderboardType.playerType;
  }, [leaderboardType]);

  const { data, isLoading } = useQuery<LeaderboardPlayer[]>({
    queryKey: [
      'leaderboard',
      league,
      leaderboardType.playerType,
      leaderboardType.stat,
      season,
      type,
      position,
    ],
    queryFn: () => {
      const endpoint =
        leaderboardType.playerType === 'Goalies' ? `/goalies` : `/skaters`;
      const seasonParam = season ? `&season=${season}` : '';
      const positionParam = position
        ? `&position=${position === 'Defensemen' ? 'd' : 'f'}`
        : '';
      const seasonTypeParam = type
        ? `&type=${seasonTypeToApiFriendlyParam(type)}`
        : '';
      return query(
        `api/v1/leaders${endpoint}/${
          leaderboardType.stat
        }?limit=10&league=${leagueNameToId(
          league,
        )}${seasonParam}${positionParam}${seasonTypeParam}`,
      );
    },
  });

  const currentStatName = (data && data[0]?.statName) ?? leaderboardType.stat;

  const dataOrPlaceholderArray = data ?? new Array(10).fill({});

  return (
    <div className="flex w-full min-w-[250px] flex-col py-4 px-6 sm:w-[450px]">
      <div className="min-h-[30px] min-w-[50px] text-2xl font-semibold capitalize">
        {currentStatName}
      </div>
      <div>
        {dataOrPlaceholderArray.map(
          (
            player: Partial<LeaderboardPlayer>,
            i,
            data: Partial<LeaderboardPlayer>[],
          ) => (
            <Skeleton
              key={i}
              className={classnames('w-full', isLoading && 'my-px')}
              isLoaded={!isLoading}
              fadeDuration={(i + 1) / 2}
            >
              <div
                className={classnames(
                  'relative flex min-h-[30px] items-center  border-b-2 border-b-grey300',
                  i === 0 ? 'py-0.5 text-xl font-semibold' : 'text-lg',
                )}
              >
                <StatVisualizer
                  currentStat={player.stat}
                  leaderStat={data[0].stat}
                />
                <div className="z-10 ml-2.5 flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                  <span
                    className={classnames(
                      'w-6 font-mont',
                      i === 0 ? 'text-base' : 'text-sm',
                    )}
                  >
                    {i + 1}.
                  </span>
                  <TeamLogo
                    league={league}
                    teamAbbreviation={player.team?.abbr}
                    className={classnames(
                      'mr-1',
                      i === 0 ? 'h-7 w-7' : 'h-5 w-5',
                    )}
                  />
                  <Link
                    href={{
                      pathname: `/[league]/player/[id]`,
                      query: {
                        ...onlyIncludeSeasonAndTypeInQuery(router.query),
                        id: player.id,
                      },
                    }}
                    className="overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
                  >
                    {player.name}
                  </Link>
                </div>
                <div className="mx-2.5 flex-1 text-right font-mont">
                  {leaderboardType.stat === 'shotpct'
                    ? `${((player.stat ?? 0) * 100).toFixed(2)}%`
                    : leaderboardType.stat === 'gsaa'
                    ? (player.stat ?? 0).toFixed(2)
                    : player.stat}
                </div>
              </div>
            </Skeleton>
          ),
        )}
      </div>
    </div>
  );
};

const StatVisualizer = ({
  currentStat,
  leaderStat,
}: {
  currentStat: number | undefined;
  leaderStat: number | undefined;
}) => {
  const widthPercentage = useMemo(() => {
    if (!currentStat || !leaderStat) return 0;
    if (leaderStat === 0) {
      return 0;
    }
    const isDescending = currentStat <= leaderStat;
    return (
      (isDescending ? currentStat / leaderStat : leaderStat / currentStat) * 100
    );
  }, [currentStat, leaderStat]);

  return (
    <div
      className="absolute h-full bg-grey700 opacity-10"
      style={{
        width: `${widthPercentage}%`,
      }}
    />
  );
};
