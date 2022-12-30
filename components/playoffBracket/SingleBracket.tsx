import { Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';

import { useSeason } from '../../hooks/useSeason';
import { PlayoffsRound } from '../../pages/api/v1/standings/playoffs';
import { League, leagueNameToId } from '../../utils/leagueHelpers';
import { query } from '../../utils/query';

import { PlayoffBracketSeries } from './PlayoffBracketSeries';

export const SingleBracket = ({
  data,
  league,
  className,
}: {
  data: PlayoffsRound[];
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
        'mt-6 flex h-full w-full flex-wrap items-center justify-center text-center',
        className,
      )}
    >
      {data.map((round, i) => (
        <div className="flex w-[270px] flex-col items-center" key={i}>
          <h2 className="mb-2.5 text-2xl font-bold">
            {round.length === 1 ? 'Finals' : `Round ${i + 1}`}
          </h2>
          {round.map((series) => (
            <PlayoffBracketSeries
              key={`${series.team1.id}${series.team2.id}`}
              series={series}
              teamData={teamData}
              league={league}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
