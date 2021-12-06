import useSWR from 'swr';

import { Player } from '..';

const useSkaterStatsId = (
  id: number,
  league: string,
  seasonType: string
): {
  ratings: Array<Player>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const seasonTypeParam = seasonType
    ? `&type=${seasonType.toLowerCase().replace('-', '')}`
    : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/players/stats/${id}?league=${leagueid}${seasonTypeParam}`
  );

  return {
    ratings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useSkaterStatsId;
