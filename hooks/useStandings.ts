import useSWR from 'swr';

import { SEASON_TYPE } from '../components/Selector/SeasonTypeSelector';
import { Standings } from '../pages/api/v1/standings';
import { PlayoffsRound } from '../pages/api/v1/standings/playoffs';
import { getQuerySeason } from '../utils/season';
import { getQuerySeasonType } from '../utils/seasonType';

interface Hook {
  data: Standings | Array<PlayoffsRound>;
  isLoading: boolean;
  isError: boolean;
}

const useStandings = (league: string, display = 'league'): Hook => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const seasonType = SEASON_TYPE[getQuerySeasonType().toUpperCase()];
  const endpoint =
    seasonType === 'Playoffs'
      ? 'standings/playoffs'
      : seasonType === 'Pre-Season'
      ? 'standings/preseason'
      : 'standings';
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
