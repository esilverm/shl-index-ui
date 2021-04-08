import useSWR from 'swr';
import { Player, Goalie } from '../';
import { getQuerySeason } from '../utils/season';

const useStandings = (
  league: string,
  team: number,
  seasonType: string
): {
  roster: Array<Player | Goalie>;
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
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/teams/${team}/roster/stats?league=${leagueid}${seasonParam}${seasonTypeParam}`
  );

  return {
    roster: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useStandings;
