export interface Player {
  id: number;
  name: string;
  position: string;
  league: number;
  team: number;
  season: number;
  gamesPlayed: number;
  timeOnIce: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  pim: number;
  ppGoals: number;
  ppAssists: number;
  ppPoints: number;
  ppTimeOnIce: number;
  shGoals: number;
  shAssists: number;
  shPoints: number;
  shTimeOnIce: number;
  fights: number;
  fightWins: number;
  fightLosses: number;
  hits: number;
  giveaways: number;
  takeaways: number;
  shotsBlocked: number;
  shotsOnGoal: number;
  gameRating: number;
  offensiveGameRating: number;
  defensiveGameRating: number;
  advancedStats: {
    PDO: number;
    GF60: number;
    GA60: number;
    SF60: number;
    SA60: number;
    CF: number;
    CA: number;
    CFPct: number;
    CFPctRel: number;
    FF: number;
    FA: number;
    FFPct: number;
    FFPctRel: number;
  };
}

export interface Goalie {
  id: number;
  name: string;
  position: string;
  league: number;
  team: number;
  season: number;
  gamesPlayed: number;
  minutes: number;
  wins: number;
  losses: number;
  ot: number;
  shotsAgainst: number;
  saves: number;
  goalsAgainst: number;
  gaa: number;
  shutouts: number;
  savePct: number;
  gameRating: number;
}

export interface Team {
  id: number;
  season: number;
  conference: number;
  division: number;
  name: string;
  nameDetails: { first: string; second: string };
  abbreviation: string;
  location: string;
  colors: { primary: string; secondary: string; text: string };
  stats: {
    wins: number;
    losses: number;
    overtimeLosses: number;
    shootoutWins: number;
    shootoutLosses: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    winPercent: number;
  };
}

export interface PlayerRatings {
  id: number;
  name: string;
  position: string;
  league: number;
  team: string;
  season: number;
  height: number;
  weight: number;
  ratings: {
    screening: number;
    gettingOpen: number;
    passing: number;
    puckhandling: number;
    shootingAccuracy: number;
    shootingRange: number;
    offensiveRead: number;
    checking: number;
    hitting: number;
    positioning: number;
    stickchecking: number;
    shotBlocking: number;
    faceoffs: number;
    defensiveRead: number;
    acceleration: number;
    agility: number;
    balance: number;
    speed: number;
    stamina: number;
    strength: number;
    fighting: number;
    aggression: number;
    bravery: number;
  };
}

export interface GoalieRatings {
  id: number;
  name: string;
  position: string;
  league: number;
  team: string;
  season: number;
  height: number;
  weight: number;
  ratings: {
    blocker: number;
    glove: number;
    passing: number;
    pokeCheck: number;
    positioning: number;
    rebound: number;
    recovery: number;
    puckhandling: number;
    lowShots: number;
    reflexes: number;
    skating: number;
    mentalToughness: number;
    goalieStamina: number;
  };
}

export interface SearchTerm {
  id: string;
  term: string;
}
