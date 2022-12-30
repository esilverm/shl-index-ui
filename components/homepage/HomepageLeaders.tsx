import { Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { useSeason } from '../../hooks/useSeason';
import { useSeasonType } from '../../hooks/useSeasonType';
import { League, leagueNameToId } from '../../utils/leagueHelpers';
import { query } from '../../utils/query';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { seasonTypeToApiFriendlyParam } from '../../utils/seasonTypeHelpers';
import { Link } from '../common/Link';
import { LeaderboardPlayer } from '../leaderboard/shared';
import { TeamLogo } from '../TeamLogo';

export const HomepageLeaders = ({
  league,
  skaterType,
  stat,
}: {
  league: League;
  skaterType: 'skater' | 'goalie';
  stat: 'goals' | 'points' | 'wins' | 'shutouts';
}) => {
  const { season } = useSeason();
  const { type } = useSeasonType();
  const router = useRouter();

  const { data, isLoading } = useQuery<[LeaderboardPlayer]>({
    queryKey: ['homepageLeaders', league, season, type, skaterType, stat],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';
      const seasonTypeParam = type
        ? `&type=${seasonTypeToApiFriendlyParam(type)}`
        : '';
      return query(
        `/api/v1/leaders/${skaterType}s/${stat}?position=all&limit=1&league=${leagueNameToId(
          league,
        )}${seasonParam}${seasonTypeParam}`,
      );
    },
  });

  return (
    <div className="flex justify-between py-4">
      <div className="flex flex-col justify-between">
        <Skeleton isLoaded={!isLoading}>
          <Link
            href={{
              pathname: `/[league]/player/[id]`,
              query: {
                ...onlyIncludeSeasonAndTypeInQuery(router.query),
                id: data ? data[0].id : 0,
              },
            }}
          >
            <h4 className="text-xl font-semibold hover:underline">
              {data ? data[0].name : 'Player Name'}
            </h4>
          </Link>
        </Skeleton>
        <div className="font-mont">
          <Skeleton isLoaded={!isLoading} className="inline">
            <span className="mr-1 text-5xl font-extrabold">
              {data ? data[0].stat : 0}
            </span>
          </Skeleton>
          <span className="text-base uppercase">{stat}</span>
        </div>
      </div>
      <TeamLogo
        league={league}
        teamAbbreviation={data ? data[0].team.abbr : undefined}
        className="aspect-square w-1/3 max-w-[120px]"
      />
    </div>
  );
};
