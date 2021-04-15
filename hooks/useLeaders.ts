import useSWR from 'swr';
import { PlayerRatings } from '../';
import { getQuerySeason } from '../utils/season';

const useLeaders = (
  league: string,
  playerType = 'skater',
  stat = 'goals',
  limit = 10,
  seasonType = 'Regular Season'
): {
  leaders: Array<PlayerRatings>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const season = getQuerySeason();
  const seasonTypeParam =
    seasonType === 'Playoffs'
      ? '&type=playoffs'
      : seasonType === 'Pre-Season'
      ? '&type=preseason'
      : '&type=regular';
  const seasonParam = season ? `&season=${season}` : '';
  const limitParam = limit ? `&limit=${limit}` : '';
  const endpoint =
    playerType.toLowerCase() === 'goalie'
      ? `/goalies/${stat}`
      : `/skaters/${stat}`;

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/leaders/${endpoint}?league=${leagueid}${seasonParam}${limitParam}${seasonTypeParam}`
  );

  return {
    leaders: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useLeaders;
