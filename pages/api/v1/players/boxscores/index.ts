//@ts-nocheck
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { playerId, leagueId = 0, season: seasonId, isGoalie } = req.query;

  const playerIdParam = playerId ?? 0;
  const leagueIdParam = leagueId ?? 0;
  const seasonIdParam = seasonId ?? 0;

  if (isGoalie) {
    const goalieBoxScoreData: any[] = await query(
      SQL`CALL \`admin_simdata\`.\`asron_get_boxscore_goalies\`(${seasonIdParam},${playerIdParam},${leagueIdParam});`,
    );

    const parsed: any[] = goalieBoxScoreData.map((datum) => {
      return {
        leagueId: datum.LeagueID,
        seasonId: datum.SeasonID,
        teamId: datum.TeamID,
        gameId: datum.gameID,
        playerId: datum.playerID,
        gameRating: datum.GameRating,
        savePercentage: datum.SavePct,
        goalsAgainst: datum.GoalsAgainst,
        saves: datum.Saves,
        shotsAgainst: datum.ShotsAgainst,
        minutes: datum.Minutes,
        penaltiesInMinutes: datum.PIM,
      };
    });
    res.status(200).json(parsed);
  } else {
    const skaterBoxScoreData: any[] =
      await query(SQL`CALL \`admin_simdata\`.\`asron_get_boxscore_skaters\`(${seasonIdParam},${playerIdParam},${leagueIdParam});
    `);
    const parsed: any[] = skaterBoxScoreData.map((datum) => {
      return {
        assists: datum.A,
        blockedShots: datum.BS,
        defensiveGameRating: datum.DGR,
        evenStrengthGoals: datum.EV,
        faceoffLosses: datum.FOL,
        faceoffPercentage: datum.FOPct,
        faceoffWins: datum.FOW,
        goals: datum.G,
        gameId: datum.gameID,
        gameRating: datum.GR,
        giveaways: datum.GV,
        hits: datum.HT,
        leagueId: datum.LeagueID,
        missedShots: datum.MS,
        offensiveGameRating: datum.OGR,
        penaltiesInMinutes: datum.PIM,
        playerId: datum.playerID,
        plusMinus: datum.PlusMinus,
        powerPlayGoals: datum.PP,
        seasonId: datum.SeasonID,
        shorthandedGoals: datum.SH,
        shifts: datum.SHF,
        shotsOnGoal: datum.SOG,
        teamId: datum.teamId,
        takeaways: datum.TK,
        timeOnIce: datum.TOT,
      };
    });
    res.status(200).json(parsed);
  }
};
