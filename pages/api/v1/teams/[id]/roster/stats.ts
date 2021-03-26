import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../../../lib/db';
import use from '../../../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

const seasonTypes = ['Pre-Season', 'Regular Season', 'Playoffs'];
export type SeasonType = typeof seasonTypes[number];

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  const {
    id,
    league = 0,
    SeasonType,
    season: seasonid,
  } = req.query;

  if (Number.isNaN(+id)) {
    res.status(400).send('Error: Team id must be a number');
    return;
  }

  let type: string;
  if (SeasonType === 'Pre-Season') {
    type = 'ps';
  }
  else if (SeasonType === 'Playoffs') {
    type = 'po';
  }
  else {
    type = 'rs';
  }

  const [season] =
    (seasonid !== undefined &&
      !Number.isNaN(seasonid) && [{ SeasonID: seasonid }]) ||
    (await query(
      SQL`
      SELECT DISTINCT SeasonID
      FROM `.append(`player_skater_stats_${type}`).append(SQL`
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `)
    ));

  const playerStats = await query(
    SQL`
    SELECT s.PlayerID, s.LeagueID, s.SeasonID, s.TeamID, p.\`Last Name\` AS Name, s.GP, s.G, s.A, s.PlusMinus, s.PIM, s.PPG, s.PPA, s.SHG, s.SHA, s.Fights, s.Fights_Won, s.HIT, s.GvA, s.TkA, s.SB, s.GR, s.OGR, s.DGR, s.SOG, s.TOI, s.PPTOI, s.SHTOI, s.PDO, s.GF60, s.GA60, s.SF60, s.SA60, s.CF, s.CA, s.CFPct, s.CFPctRel, s.FF, s.FA, s.FFPct, s.FFPctRel, r.LD, r.RD, r.LW, r.C, r.RW
    FROM `.append(`player_skater_stats_${type} AS s`).append(SQL`
    INNER JOIN player_master as p
    ON s.SeasonID = p.SeasonID 
    AND s.LeagueID = p.LeagueID
    AND s.PlayerID = p.PlayerID
    INNER JOIN player_ratings as r
    ON s.SeasonID = r.SeasonID 
    AND s.LeagueID = r.LeagueID
    AND s.PlayerID = r.PlayerID
    WHERE s.LeagueID=${+league}
      AND s.SeasonID=${season.SeasonID}
      AND s.TeamID=${+id}
  `)
  );

  const goalieStats = await query(
    SQL`
    SELECT s.PlayerID, s.LeagueID, s.SeasonID, s.TeamID, p.\`Last Name\` AS Name, s.GP, s.Minutes, s.Wins, s.Losses, s.OT, s.ShotsAgainst, s.Saves, s.GoalsAgainst, s.GAA, s.Shutouts, s.SavePct, s.GameRating
    FROM `.append(`player_goalie_stats_${type} AS s`).append(SQL`
    INNER JOIN player_master as p
    ON s.SeasonID = p.SeasonID 
    AND s.LeagueID = p.LeagueID
    AND s.PlayerID = p.PlayerID
    WHERE s.LeagueID=${+league}
      AND s.SeasonID=${season.SeasonID}
      AND s.TeamID=${+id}
  `)
  );

  const parsed = [...playerStats, ...goalieStats].map((player) => {
    if ('Wins' in player) {
      // is Goalie
      return {
        id: player.PlayerID,
        name: player.Name,
        position: 'G',
        league: player.LeagueID,
        team: player.TeamID,
        season: player.SeasonID,
        gamesPlayed: player.GP,
        minutes: player.Minutes,
        wins: player.Wins,
        losses: player.Losses,
        ot: player.OT,
        shotsAgainst: player.ShotsAgainst,
        saves: player.Saves,
        goalsAgainst: player.GoalsAgainst,
        gaa: player.GAA,
        shutouts: player.Shutouts,
        savePct: player.SavePct,
        gameRating: player.GameRating,
      };
    }

    const position = ['LD', 'RD', 'LW', 'C', 'RW'][
      [+player.LD, +player.RD, +player.LW, +player.C, +player.RW].indexOf(20)
    ];

    return {
      id: player.PlayerID,
      name: player.Name,
      position,
      league: player.LeagueID,
      team: player.TeamID,
      season: player.SeasonID,
      gamesPlayed: player.GP,
      timeOnIce: player.TOI + player.PPTOI + player.SHTOI, // in seconds
      goals: player.G,
      assists: player.A,
      points: player.G + player.A,
      plusMinus: player.PlusMinus,
      pim: player.PIM,
      ppGoals: player.PPG,
      ppAssists: player.PPA,
      ppPoints: player.PPG + player.PPA,
      ppTimeOnIce: player.PPTOI,
      shGoals: player.SHG,
      shAssists: player.SHA,
      shPoints: player.SHG + player.SHA,
      shTimeOnIce: player.SHTOI,
      fights: player.Fights,
      fightWins: player.Fights_Won,
      fightLosses: player.Fights - player.Fights_Won,
      hits: player.HIT,
      giveaways: player.GvA,
      takeaways: player.TkA,
      shotsBlocked: player.SB,
      shotsOnGoal: player.SOG,
      gameRating: player.GR,
      offensiveGameRating: player.OGR,
      devensiveGameRating: player.DGR,

      advancedStats: {
        PDO: player.PDO,
        GF60: player.GF60,
        GA60: player.GA60,
        SF60: player.SF60,
        SA60: player.SA60,
        CF: player.CF,
        CA: player.CA,
        CFPct: player.CFPct,
        CFPctRel: player.CFPctRel,
        FF: player.FF,
        FA: player.FA,
        FFPct: player.FFPct,
        FFPctRel: player.FFPctRel,
      },
    };
  });

  res.status(200).json(parsed);
};
