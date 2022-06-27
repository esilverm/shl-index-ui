import useSWR from 'swr';

import { Goalie } from '..';
import { SEASON_TYPE } from '../components/Selector/SeasonTypeSelector';
import { getQuerySeasonType } from '../utils/seasonType';

const useGoalieStatsId = (
  id: number,
  league: string
): {
  ratings: Array<Goalie>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const seasonType = SEASON_TYPE[getQuerySeasonType().toUpperCase()];
  const seasonTypeParam = seasonType
    ? `&type=${seasonType.toLowerCase().replace('-', '')}`
    : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/goalies/stats/${id}?league=${leagueid}${seasonTypeParam}`
  );

  return {
    ratings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useGoalieStatsId;
