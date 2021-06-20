import useSWR from 'swr';

import { getQuerySeason } from '../utils/season';

export interface PlayerWithStat {
  id: number;
  name: string;
  league: number;
  team: {
    id: number;
    name: string;
    nickname: string;
    abbr: string;
  };
  season: number;
  stat: number | string;
  statName: string;
}

const useLeaders = (
  league: string,
  playerType = 'skater',
  stat = 'goals',
  seasonType = 'Regular Season',
  limit = 10
): {
  leaders: Array<PlayerWithStat>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const season = getQuerySeason();
  const seasonTypeParam =
    seasonType === 'Playoffs'
      ? '&type=playoffs'
      : seasonType === 'Pre-Season'
      ? '&type=preseason'
      : '&type=regular';
  const seasonParam = season ? `&season=${season}` : '';
  const limitParam = limit ? `&limit=${limit}` : '';
  const endpoint =
    playerType.toLowerCase() === 'goalie'
      ? `/goalies/${stat}`
      : `/skaters/${stat}`;

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/leaders${endpoint}?league=${leagueid}${seasonParam}${limitParam}${seasonTypeParam}`
  );

  return {
    leaders: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useLeaders;
