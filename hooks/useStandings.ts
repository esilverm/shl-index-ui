import useSWR from 'swr';

const useStandings = (
  league: string,
  display = 'league'
): {
  standings: {
    position: number;
    id: number;
    name: string;
    location: string;
    abbreviation: string;
    gp: number;
    wins: number;
    losses: number;
    OTL: number;
    points: number;
    winPercent: string;
    ROW: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDiff: number;
    home: {
      wins: number;
      losses: number;
      OTL: number;
    };
    away: {
      wins: number;
      losses: number;
      OTL: number;
    };
    shootout: {
      wins: number;
      losses: number;
    };
  };
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/standings?league=${leagueid}&display=${display}`
  );

  return {
    standings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useStandings;
