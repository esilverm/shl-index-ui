export type InternalPlayerAchievement = {
  playerUpdateID: number | null;
  playerName: string;
  userID: number | null;
  fhmID: number;
  leagueID: number;
  seasonID: number;
  teamID: number;
  achievement: number;
  achievementName: string;
  achievementDescription: string;
  isAward: boolean;
  won: boolean;
};

export type InternalIndexPlayerID = {
  playerUpdateID: number;
  leagueID: number;
  indexID: number;
  startSeason: number;
};
