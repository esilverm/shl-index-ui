import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import { League, leagueNameToId } from '../utils/leagueHelpers';
import { query } from '../utils/query';

export const useSeason = () => {
  const router = useRouter();

  const { league, season } = router.query;

  const { data, isLoading } = useQuery<Array<{ season: string }>, Error>({
    queryKey: ['seasons', league],
    queryFn: () =>
      query(
        `api/v1/leagues/seasons?league=${leagueNameToId(league as League)}`,
      ),
    cacheTime: 1000 * 60 * 60 * 24,
  });

  const seasonsList = useMemo(
    () =>
      data ? data?.map((leagueEntry) => parseInt(leagueEntry.season)) : [],
    [data],
  );

  const selectedSeason = useMemo(() => {
    const currentVisibleSeason = season as string;
    if (!currentVisibleSeason && seasonsList) {
      return Math.max(...seasonsList);
    }
    return parseInt(currentVisibleSeason);
  }, [season, seasonsList]);

  const isActiveSeason = useMemo(() => {
    return selectedSeason === Math.max(...seasonsList);
  }, [seasonsList, selectedSeason]);

  const setSeason = useCallback(
    (season: number) =>
      router.push({
        query: {
          ...router.query,
          season,
        },
      }),
    [router],
  );

  // If the season is less than or equal to 52 then the data comes from the STHS sim engine
  const isSTHS = useMemo(() => selectedSeason <= 52, [selectedSeason]);

  return {
    // Note: If the season is not loaded yet we will get -Infinity due to the math.max so we should instead give undefined.
    season: selectedSeason === -Infinity ? undefined : selectedSeason,
    seasonsList,
    seasonLoading: isLoading,
    setSeason,
    isActiveSeason,
    isSTHS,
  };
};
