import useSWR from 'swr';

import { GoalieRatings } from '..';
import { getQuerySeason } from '../utils/season';

const useGoalieInfo = (
  id: number,
  league: string
): {
  ratings: Array<GoalieRatings>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const season = getQuerySeason();
  const seasonParam = season ? `&season=${season}` : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/goalies/${id}?league=${leagueid}${seasonParam}`
  );

  return {
    ratings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useGoalieInfo;
