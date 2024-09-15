const leagues = ['shl', 'smjhl', 'iihf', 'wjc'] as const;
export type League = (typeof leagues)[number];

export const leagueNameToId = (league: League) => leagues.indexOf(league);

export const isMainLeague = (league: League): boolean =>
  league === 'shl' || league === 'smjhl';

export const shouldShowDivision = (
  league: League,
  season?: number,
): boolean => {
  return league === 'shl' && !!season && season > 46 || (league === 'smjhl' && !!season && season < 76);
};

export const isSTHS = (
  season?: number,
): boolean => {
  return  !!season && season <= 52;
}
