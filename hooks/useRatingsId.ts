import useSWR from 'swr';

import { PlayerRatings } from '../';

const useRatingsId = (
  id: number,
  league: string
): {
  ratings: Array<PlayerRatings>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/players/ratings/${id}?league=${leagueid}`
  );

  return {
    ratings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useRatingsId;
