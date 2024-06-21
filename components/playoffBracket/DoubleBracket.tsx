import { Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { useCallback, useMemo } from 'react';

import { useSeason } from '../../hooks/useSeason';
import {
  PlayoffsRound,
  PlayoffsSeries,
} from '../../pages/api/v1/standings/playoffs';
import { League, leagueNameToId } from '../../utils/leagueHelpers';
import { query } from '../../utils/query';

import { PlayoffBracketSeries } from './PlayoffBracketSeries';
import {
  BracketConference,
  getSeriesByConference,
  LEAGUE_WIN_CONDITION,
  sortByDivision,
} from './shared';

export const DoubleBracket = ({
  data,
  league,
  className,
}: {
  data: PlayoffsRound[] | undefined;
  league: League;
  className?: string;
}) => {
  const { season } = useSeason();
  const { data: teamData, isLoading } = useQuery({
    queryKey: ['teamData', league, season],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';
      return query(
        `api/v1/teams?league=${leagueNameToId(league)}${seasonParam}`,
      );
    },
  });

  const inferCurrentSeriesFromPreviousRound = useCallback(
    (seriesToReturn: number, previousRound: PlayoffsSeries[]) => {
      return Array.apply(null, Array(seriesToReturn)).flatMap((_, i) => {
        const previousSeriesWinners: Array<PlayoffsSeries['team1']> = [
          previousRound[2 * i],
          previousRound[2 * i + 1],
        ].map((prevSeries) => {
          if (!prevSeries) return {};
          let winningTeam: PlayoffsSeries['team1'] = {};

          if (prevSeries.team1.wins === LEAGUE_WIN_CONDITION[league]) {
            winningTeam = prevSeries.team1;
          } else if (prevSeries.team2.wins === LEAGUE_WIN_CONDITION[league]) {
            winningTeam = prevSeries.team2;
          }

          return {
            ...winningTeam,
            wins: undefined,
          };
        });

        return {
          team1: previousSeriesWinners[0],
          team2: previousSeriesWinners[1],
        } as Omit<PlayoffsSeries, 'league' | 'season'>;
      });
    },
    [league],
  );

  const finalsRoundDataIfExists = useMemo(() => {
    if (!data || !data[data.length - 1])
      return inferCurrentSeriesFromPreviousRound(1, [])[0];
    const lastRound = data[data.length - 1];
    const isSingleSeries = lastRound.length === 1;
    const hasMixedConferences =
      lastRound[0].team1.conference !== lastRound[0].team2.conference;

    // If it exists, return the value from the db
    if (isSingleSeries && hasMixedConferences) return lastRound[0];

    // If we haven't played round 3 yet
    if (data.length < 3) return inferCurrentSeriesFromPreviousRound(1, [])[0];

    // If round 3 data exists, attempt to infer
    return inferCurrentSeriesFromPreviousRound(1, data[2])[0];
  }, [data, inferCurrentSeriesFromPreviousRound]);

  const westernConferenceBracketData = useMemo(() => {
    const totalBracketRounds = 3;
    const seriesPerRound = [4, 2, 1];

    if (!data) return [];
    return Array.apply(null, Array(totalBracketRounds)).map((_, i) => {
      if (i < data.length) {
        // We have data from FHM for the given round
        const roundSeries = getSeriesByConference(
          data[i],
          BracketConference.WESTERN,
        );
        return sortByDivision(roundSeries);
      } else {
        // Infer next round from previous round data
        const previousRoundInfo = data[i - 1]
          ? getSeriesByConference(data[i - 1], BracketConference.WESTERN)
          : [];
        const sortedRound = sortByDivision(previousRoundInfo);

        return inferCurrentSeriesFromPreviousRound(
          seriesPerRound[i],
          sortedRound,
        );
      }
    });
  }, [data, inferCurrentSeriesFromPreviousRound]);

  const easternConferenceBracketData = useMemo(() => {
    const totalBracketRounds = 3;
    const seriesPerRound = [4, 2, 1];

    if (!data) return [];

    return Array.apply(null, Array(totalBracketRounds)).map((_, i) => {
      if (i < data.length) {
        // We have data from FHM for the given round
        const roundSeries = getSeriesByConference(
          data[i],
          BracketConference.EASTERN,
        );
        return sortByDivision(roundSeries);
      } else {
        // Infer next round from previous round data
        const previousRoundInfo = data[i - 1]
          ? getSeriesByConference(data[i - 1], BracketConference.EASTERN)
          : [];
        const sortedRound = sortByDivision(previousRoundInfo);

        return inferCurrentSeriesFromPreviousRound(
          seriesPerRound[i],
          sortedRound,
        );
      }
    });
  }, [data, inferCurrentSeriesFromPreviousRound]);

  if (isLoading || !teamData || !data) {
    return (
      <div className={className}>
        <Spinner size="xl" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={classnames(
          'mt-6 flex h-full w-11/12 items-center justify-center text-center text-xl font-bold',
          className,
        )}
      >
        Playoffs bracket is not yet available
      </div>
    );
  }

  return (
    <div
      className={classnames(
        'mt-20 flex size-full flex-row content-between items-center pt-2.5',
        className,
      )}
    >
      <div className="flex flex-wrap items-center">
        {westernConferenceBracketData.map((round, i) => (
          <div className="flex w-40 flex-col items-center" key={i}>
            <h2 className="mb-2.5 text-2xl font-bold">
              {round.length === 1 &&
              round[0].team1.conference !== round[0].team2.conference
                ? 'Finals'
                : `Round ${i + 1}`}
            </h2>
            {round.map((series) => (
              <PlayoffBracketSeries
                key={`${series.team1.id}${series.team2.id}`}
                series={series}
                teamData={teamData}
                league={league}
                shouldUseTeamShortName
              />
            ))}
          </div>
        ))}
      </div>
      <div className="m-auto flex w-40 flex-col items-center">
        <h2 className="mb-2.5 text-2xl font-bold">Finals</h2>
        <PlayoffBracketSeries
          key={`${finalsRoundDataIfExists.team1.id}${finalsRoundDataIfExists.team2.id}`}
          series={finalsRoundDataIfExists}
          teamData={teamData}
          league={league}
          shouldUseTeamShortName
        />
      </div>
      <div className="flex flex-row-reverse flex-wrap items-center">
        {easternConferenceBracketData.map((round, i) => (
          <div className="flex w-40 flex-col items-center" key={i}>
            <h2 className="mb-2.5 text-2xl font-bold">
              {round.length === 1 &&
              round[0].team1.conference !== round[0].team2.conference
                ? 'Finals'
                : `Round ${i + 1}`}
            </h2>
            {round.map((series) => (
              <PlayoffBracketSeries
                key={`${series.team1.id}${series.team2.id}`}
                series={series}
                teamData={teamData}
                league={league}
                shouldUseTeamShortName
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
