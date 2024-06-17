const leagues = ['shl', 'smjhl', 'iihf', 'wjc'] as const;
export type League = typeof leagues[number];

export const leagueNameToId = (league: League) => leagues.indexOf(league);

export const isMainLeague = (league: League): boolean =>
  league === 'shl' || league === 'smjhl';

export const shouldShowDivision = (league: League, season: number): boolean => { 
  return league === 'shl' || (league === 'smjhl' && season < 76);
};
