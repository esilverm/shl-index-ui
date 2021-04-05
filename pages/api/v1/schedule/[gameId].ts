import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';
import { Game, GameRow } from '.';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

interface TeamRecord {
  ConferenceID: number;
  DivisionID: number;
  GA: number;
  GF: number;
  LeagueID: number;
  Losses: number;
  OTL: number;
  PCT: number;
  Points: number;
  SOL: number;
  SOW: number;
  SeasonID: number;
  TeamID: number;
  Ties: number;
  Wins: number;
}

export interface Matchup {
  game: Game;
  awayRecord: string;
  homeRecord: string;
  previousMatchups: Game[];
}

const parseTeamRecord = (record: TeamRecord) => record ? `${record.Wins}-${record.Losses}-${record.OTL}` : '0-0-0';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  const { gameId } = req.query;
  const gameSearch = SQL`
    SELECT *
    FROM slugviewer
    WHERE Slug=${gameId}
  `;

  const game: GameRow[] = await query(gameSearch);
  if (game.length !== 1) {
    return res.status(404).json(`No game found with id ${gameId}`);
  }
  const activeGame = game[0];
  const { SeasonID, LeagueID, Away, Home } = activeGame;

  const awayRecordSearch = SQL`
    SELECT *
    FROM team_records
    WHERE SeasonID=${SeasonID}
      AND LeagueID=${LeagueID}
      AND TeamId=${Away};
  `;
  const homeRecordSearch = SQL`
    SELECT *
    FROM team_records
    WHERE SeasonID=${SeasonID}
      AND LeagueID=${LeagueID}
      AND TeamId=${Home};
  `;
  const previousMatchupsSearch = SQL`
    SELECT *
    FROM slugviewer
    WHERE SeasonID=${SeasonID}
      AND LeagueID=${LeagueID}
      AND (Home=${Away} OR Away=${Away})
      AND (Home=${Home} OR Away=${Home})
    ORDER BY CAST(Date as DATE) DESC;
  `;

  const awayRecordData = await query(awayRecordSearch);
  const homeRecordData = await query(homeRecordSearch);
  const previousMatchups = await query(previousMatchupsSearch);
  const awayRecord = parseTeamRecord(awayRecordData[0]);
  const homeRecord = parseTeamRecord(homeRecordData[0]);

  res.status(200).json({
    game: activeGame,
    awayRecord: awayRecord,
    homeRecord: homeRecord,
    previousMatchups
  });
};
