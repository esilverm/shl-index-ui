import useSWR from 'swr';

import { Player } from '..';
import { getQuerySeason } from '../utils/season';

const useSkaterStats = (
  league: string,
  seasonType: string
): {
  ratings: Array<Player>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const season = getQuerySeason();
  const seasonParam = season ? `&season=${season}` : '';
  const seasonTypeParam = seasonType
    ? `&type=${seasonType.toLowerCase().replace('-', '')}`
    : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/players/stats?league=${leagueid}${seasonParam}${seasonTypeParam}`
  );

  return {
    ratings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useSkaterStats;
