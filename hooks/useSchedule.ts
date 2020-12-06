import useSWR from 'swr';
import { Game } from '../pages/api/v1/schedule';

const useSchedule = (
  league: string,
  seasonType = 'Regular Season'
): {
  games: Array<Game>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/schedule/header?league=${leagueid}&type=${seasonType}` // TODO: Revert to index endpoint
  );

  return {
    games: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useSchedule;
