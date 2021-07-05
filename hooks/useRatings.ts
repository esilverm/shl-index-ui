import useSWR from 'swr';
import { getQuerySeason } from '../utils/season';
import { PlayerRatings } from '../';

const useRatings = (
  league: string
): {
  ratings: Array<PlayerRatings>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const season = getQuerySeason();
  const seasonParam = season ? `&season=${season}` : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/players/ratings?league=${leagueid}${seasonParam}`
  );

  return {
    ratings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useRatings;
