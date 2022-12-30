export const leaderboardTypes = [
  'Skaters',
  'Forwards',
  'Defensemen',
  'Goalies',
] as const;
export type LeaderboardTypes = typeof leaderboardTypes[number];

export const skaterLeaderboardStats = [
  'goals',
  'assists',
  'points',
  'plusminus',
  'shots',
  'shotpct',
  'hits',
  'fightswon',
  'penaltyminutes',
  'shotsblocked',
  'ppg',
  'shg',
] as const;
export type SkaterLeaderboardStats = typeof skaterLeaderboardStats[number];

export const goalieLeaderboardStats = [
  'wins',
  'losses',
  'otl',
  'ga',
  'gaa',
  'gsaa',
  'saves',
  'savepct',
  'shutouts',
  'gamesplayed',
] as const;
export type GoalieLeaderboardStats = typeof goalieLeaderboardStats[number];

export type LeaderboardPlayer = {
  id: number;
  name: string;
  league: number;
  team: {
    id: number;
    name: string;
    nickname: string;
    abbr: string;
  };
  season: number;
  gamesPlayed: number;
  stat: number;
  statName: string;
  statNameAbbr: string;
};
