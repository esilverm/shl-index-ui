import useSWR from 'swr';
import { Standings } from '../pages/api/v1/standings';
import { PlayoffsRound } from '../pages/api/v1/standings/playoffs';
import { getQuerySeason } from '../utils/season';

interface Hook {
  data: Standings | Array<PlayoffsRound>;
  isLoading: boolean;
  isError: boolean;
}

const useStandings = (
  league: string,
  display = 'league',
  seasonType = 'Regular Season',
): Hook => {
  console.log(seasonType)
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const endpoint = seasonType === 'Playoffs' ? 'standings/playoffs' : seasonType === 'Pre-Season' ? 'standings/preseason' : 'standings';
  const displayParam = seasonType !== 'Playoffs' ? `&display=${display}` : '';
  const season = getQuerySeason();
  const seasonParam = season ? `&season=${season}` : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/${endpoint}?league=${leagueid}${displayParam}${seasonParam}`
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useStandings;
