import { PlayoffsRound } from '../../pages/api/v1/standings/playoffs';

export const LEAGUE_WIN_CONDITION = {
  shl: 4,
  smjhl: 4,
  iihf: 1,
  wjc: 1,
};

export const BracketConference = {
  EASTERN: 0,
  WESTERN: 1,
  MIXED: -1,
} as const;
type BracketConference =
  typeof BracketConference[keyof typeof BracketConference];

export const getSeriesByConference = (
  round: PlayoffsRound,
  conference: BracketConference,
) =>
  round.filter(
    (series) =>
      series.team1.conference === series.team2.conference &&
      series.team1.conference === conference,
  );

export const sortByDivision = (round: PlayoffsRound) =>
  round.sort((a, b) =>
    (a.team1.division ?? -1) + (a.team2.division ?? -1) >
    (b.team1.division ?? -1) + (b.team2.division ?? -1)
      ? 1
      : -1,
  );
