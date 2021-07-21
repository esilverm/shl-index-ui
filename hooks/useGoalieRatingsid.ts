import useSWR from 'swr';

import { GoalieRatings } from '../';

const useGoalieRatingsId = (
  id: number,
  league: string
): {
  ratings: Array<GoalieRatings>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/goalies/ratings/${id}?league=${leagueid}${seasonParam}`
  );

  return {
    ratings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useGoalieRatingsId;
