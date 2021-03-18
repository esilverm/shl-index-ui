import useSWR from 'swr';
import { PlayerRatings } from '../';
import { getQuerySeason } from '../utils/season';

const useRatings = (
  league: string
): {
  skaterratings: Array<PlayerRatings>;
  isLoading: boolean;
  isError: boolean;
} => {
  const season = getQuerySeason();
  const seasonParam = season ? `&season=${season}` : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/players/ratings?league=${league}${seasonParam}`
  );

  return {
    skaterratings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useRatings;
