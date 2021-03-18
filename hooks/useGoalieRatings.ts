import useSWR from 'swr';
import { GoalieRatings } from '../';
import { getQuerySeason } from '../utils/season';

const useGoalieRatings = (
  league: string
): {
  goalieratingdata: Array<GoalieRatings>;
  isLoading: boolean;
  isError: boolean;
} => {
  const season = getQuerySeason();
  const seasonParam = season ? `&season=${season}` : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/goalies/ratings?league=${league}${seasonParam}`
  );

  return {
    goalieratingdata: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useGoalieRatings;
