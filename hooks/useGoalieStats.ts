import useSWR from 'swr';
import { Goalie } from '..';
import { getQuerySeason } from '../utils/season';

const useGoalieStats = (
  league: string,
  seasonType: string
): {
  ratings: Array<Goalie>;
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
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/goalies/stats?league=${leagueid}${seasonParam}${seasonTypeParam}`
  );

  return {
    ratings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useGoalieStats;
