import useSWR from 'swr';
import { Game } from '../pages/api/v1/schedule';
import { getQuerySeason } from '../utils/season';

const useSchedule = (
  league: string,
  seasonType = 'Regular Season'
): {
  games: Array<Game>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const season = getQuerySeason();
  const seasonParam = season ? `&season=${season}` : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/schedule?league=${leagueid}&type=${seasonType}${seasonParam}`
  );

  return {
    games: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useSchedule;
