import useSWR from 'swr';
import { Player } from '..';
import { getQuerySeason } from '../utils/season';

const useSkaterStats = (
  league: string
): {
  ratings: Array<Player>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const season = getQuerySeason();
  const seasonParam = season ? `&season=${season}` : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/players/stats?league=${leagueid}${seasonParam}`
  );

  return {
    ratings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useSkaterStats;