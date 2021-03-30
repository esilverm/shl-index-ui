import useSWR from 'swr';
import { Standings } from '../pages/api/v1/standings';
import { PlayoffsRound } from '../pages/api/v1/standings/playoffs';
import { getQuerySeason } from '../utils/season';

interface Hook {
  data: Standings | Array<PlayoffsRound>,
  isLoading: boolean;
  isError: boolean;
}

const useStandings = (
  league: string,
  display = 'league',
  isPlayoffs = false
): Hook => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const endpoint = isPlayoffs ? 'standings/playoffs' : 'standings';
  const displayParam = !isPlayoffs ? `&display=${display}` : '';
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
