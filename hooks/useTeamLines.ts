import useSWR from 'swr';

import { getQuerySeason } from '../utils/season';

const useTeamLines = (
  league: string,
  team: number
): {
  lines:
    | {
        [key: string]:
          | { id: number; name: string }[]
          | {
              [key: string]: { id: number; name: string };
            }
          | {
              [key: string]: {
                [key: string]: { [key: string]: { id: number; name: string } };
              };
            };
      }
    | { error: string }
    | undefined;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const season = getQuerySeason();
  const seasonParam = season ? `&season=${season}` : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/teams/${team}/lines?league=${leagueid}${seasonParam}`
  );

  return {
    lines: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useTeamLines;
