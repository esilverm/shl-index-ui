import { Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { maxBy } from 'lodash';
import { useMemo } from 'react';

import { SkaterStats } from '../../pages/api/v1/schedule/game/[gameId]';
import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { assertUnreachable } from '../../utils/assertUnreachable';
import { clone } from '../../utils/clone';
import { League } from '../../utils/leagueHelpers';
import { getPlayerShortname } from '../../utils/playerHelpers';
import { query } from '../../utils/query';

import { GamePreviewCard } from './GamePreviewCard';

const defaultStatLeaders = {
  away: {
    player: '',
    value: -Infinity,
  },
  home: {
    player: '',
    value: -Infinity,
  },
};

export const SkaterComparison = ({
  league,
  previewData,
}: {
  league: League;
  previewData: GamePreviewData | undefined;
}) => {
  const { data, isLoading } = useQuery<{
    away: SkaterStats[];
    home: SkaterStats[];
  }>({
    queryKey: [
      `gamePreviewSkaterStats`,
      previewData?.game.league,
      previewData?.game.season,
      previewData?.game.type,
      previewData?.game.awayTeam,
      previewData?.game.homeTeam,
    ],
    queryFn: () =>
      query(
        `api/v2/schedule/game/skaterStats?league=${previewData?.game.league}&season=${previewData?.game.season}&type=${previewData?.game.type}&away=${previewData?.game.awayTeam}&home=${previewData?.game.homeTeam}`,
      ),
    enabled: !!previewData,
  });

  const teamLeaders = useMemo(() => {
    const initial = {
      points: {
        label: 'Points',
        ...clone(defaultStatLeaders),
      },
      goals: {
        label: 'Goals',
        ...clone(defaultStatLeaders),
      },
      assists: {
        label: 'Assists',
        ...clone(defaultStatLeaders),
      },
      plusMinus: {
        label: '+/-',
        ...clone(defaultStatLeaders),
      },
    };

    if (!data) return initial;

    Object.entries(data).forEach(([team, roster]) => {
      Object.keys(initial).forEach((stat) => {
        const currentStat = stat as keyof typeof initial;
        const leader = maxBy(roster, (skater) => {
          switch (currentStat) {
            case 'points':
              return skater.goals + skater.assists;
            case 'goals':
            case 'assists':
            case 'plusMinus':
              return skater[currentStat];
            default:
              return assertUnreachable(currentStat);
          }
        });

        if (leader && leader.name) {
          initial[currentStat][team as 'away' | 'home'] = {
            player: leader.name,
            value:
              currentStat === 'points'
                ? leader.goals + leader.assists
                : leader[currentStat],
          };
        }
      });
    });
    return initial;
  }, [data]);

  const title = previewData?.game.played ? 'Team Leaders' : 'Players To Watch';

  return (
    <GamePreviewCard
      league={league}
      title={title}
      awayAbbr={previewData?.teams.away.abbr}
      homeAbbr={previewData?.teams.home.abbr}
    >
      <div className="flex flex-col justify-between">
        {Object.values(teamLeaders).map((leaders) => (
          <div
            className="m-4 flex items-center overflow-hidden"
            key={leaders.label}
          >
            <div className="flex min-w-[100px] flex-1 items-center justify-between font-semibold">
              <Skeleton
                isLoaded={!isLoading}
                className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
              >
                <span className="inline-block  text-sm lg:hidden">
                  {getPlayerShortname(leaders.away.player)}
                </span>
                <span className="hidden text-sm lg:inline-block">
                  {leaders.away.player}
                </span>
              </Skeleton>
              <Skeleton isLoaded={!isLoading}>
                <span
                  className={classnames(
                    'ml-2 font-mont text-2xl md:text-3xl',
                    leaders.away.value < leaders.home.value && 'text-grey500 dark:text-grey500Dark',
                  )}
                >
                  {leaders.away.value}
                </span>
              </Skeleton>
            </div>
            <span className="w-[75px] text-center text-sm">
              {leaders.label}
            </span>
            <div className="flex min-w-[100px] flex-1 items-center justify-between font-semibold">
              <Skeleton isLoaded={!isLoading}>
                <span
                  className={classnames(
                    'mr-2 font-mont text-2xl md:text-3xl',
                    leaders.home.value < leaders.away.value && 'text-grey500 dark:text-grey500Dark',
                  )}
                >
                  {leaders.home.value}
                </span>
              </Skeleton>
              <Skeleton
                isLoaded={!isLoading}
                className="overflow-hidden text-ellipsis whitespace-nowrap text-right"
              >
                <span className="inline-block text-sm lg:hidden">
                  {getPlayerShortname(leaders.home.player)}
                </span>
                <span className="hidden text-sm lg:inline-block">
                  {leaders.home.player}
                </span>
              </Skeleton>
            </div>
          </div>
        ))}
      </div>
    </GamePreviewCard>
  );
};
