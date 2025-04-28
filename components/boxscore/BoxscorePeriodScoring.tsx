import { Spinner, Tooltip } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { groupBy } from 'lodash';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import tinycolor from 'tinycolor2';

import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { BoxscoreScoring } from '../../pages/api/v3/schedule/game/boxscore/scoring';
import { League } from '../../utils/leagueHelpers';
import { getPlayerShortname } from '../../utils/playerHelpers';
import { query } from '../../utils/query';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';
import { TeamLogo } from '../TeamLogo';

import { Period } from './shared';

type BoxscoreGoalWithCurrentScore = BoxscoreScoring & {
  homeScore: number;
  awayScore: number;
};

type ShotQualityEvent = {
  teamAbbr: string;
  shotQuality: number;
};

const GoalTimingBar = ({
  goal,
  gameData,
  period,
}: {
  goal: BoxscoreGoalWithCurrentScore;
  gameData: GamePreviewData;
  period: Period;
}) => {
  const { isHomeTeamGoal, teamColor, teamColorIsDark } = useMemo<{
    isHomeTeamGoal: boolean;
    teamColor: string;
    teamColorIsDark: boolean;
  }>(() => {
    const isHomeTeamGoal = goal.teamAbbr === gameData?.teams.home.abbr;
    const teamColor = isHomeTeamGoal
      ? gameData.teams.home.primaryColor
      : gameData?.teams.away.primaryColor;
    return {
      isHomeTeamGoal,
      teamColor,
      teamColorIsDark: tinycolor(teamColor).isDark(),
    };
  }, [gameData, goal.teamAbbr]);

  return (
    <div
      className="mt-0.5 flex rounded-md border bg-grey100 font-mont text-[0.7rem] leading-5"
      style={{
        borderColor: teamColor,
      }}
    >
      <Tooltip label={`${goal.time.toLocaleString()} seconds into the period`}>
        <div
          className="mx-2 text-center font-mont"
          style={{
            color: teamColor,
          }}
        >
          {goal.readableTime} / {period}
        </div>
      </Tooltip>
      <div
        className={classnames(
          'flex-1 text-center',
          teamColorIsDark && 'text-grey100',
        )}
        style={{
          backgroundColor: teamColor,
        }}
      >
        <span className={classnames(!isHomeTeamGoal && 'font-bold')}>
          {gameData?.teams.away.abbr} {goal.awayScore}
        </span>
        ,{' '}
        <span className={classnames(isHomeTeamGoal && 'font-bold')}>
          {gameData?.teams.home.abbr} {goal.homeScore}
        </span>
      </div>
      <div
        className={classnames(goal.goalType === 'ES' && 'hidden', 'mx-1')}
        style={{
          color: teamColor,
        }}
      >
        {goal.goalType === 'PP' && 'PPG'}
        {goal.goalType === 'SH' && 'SHG'}
        {goal.goalType === 'ES, ENG' && 'ENG'}
      </div>
    </div>
  );
};

export const ShotQualityBar = ({
  shot,
  gameData,
}: {
  shot: ShotQualityEvent;
  gameData: GamePreviewData;
}) => {
  const { teamColor } = useMemo(() => {
    const isHomeTeamShot = shot.teamAbbr === gameData?.teams.home.abbr;
    const teamColor = isHomeTeamShot
      ? gameData.teams.home.primaryColor
      : gameData?.teams.away.primaryColor;
    return {
      isHomeTeamShot,
      teamColor,
      teamColorIsDark: tinycolor(teamColor).isDark(),
    };
  }, [gameData, shot.teamAbbr]);

  return (
    <div
      className="mt-0.5 flex items-center justify-center rounded-md border bg-grey100 text-center font-mont text-[0.7rem] leading-5"
      style={{
        borderColor: teamColor,
        backgroundColor: teamColor,
      }}
    >
      Shot Quality: <span className="ml-1 font-bold">{shot.shotQuality}</span>
    </div>
  );
};

const PeriodScoringColumn = ({
  league,
  gameData,
  data,
  title,
  period,
  isFHM10,
}: {
  league: League;
  gameData: GamePreviewData;
  data: BoxscoreGoalWithCurrentScore[] | undefined;
  title: string;
  period: Period;
  isFHM10: boolean;
}) => {
  const router = useRouter();
  return (
    <>
      <div className="w-full border-b border-b-table bg-boxscore-header p-2.5 font-mont text-sm text-boxscore-header">
        {title}
      </div>
      {!data ? (
        <div className="flex w-full items-center px-2.5 py-6">
          {period === 'SO'
            ? "Apologies. As of right now we don't have a way to show shootout statistics."
            : 'No Goals'}
        </div>
      ) : (
        data.map((goal, i) => {
          return (
            <div
              key={i}
              className={classnames(
                'flex w-full items-center border-b border-b-table px-2.5 py-6',
              )}
            >
              <TeamLogo
                league={league}
                teamAbbreviation={goal.teamAbbr}
                className="mx-2 size-[60px]"
              />
              <div className="flex w-full flex-col overflow-hidden text-ellipsis">
                <Link
                  href={{
                    pathname: `/[league]/player/[id]`,
                    query: {
                      ...onlyIncludeSeasonAndTypeInQuery(router.query),
                      id: goal.scorer.id,
                    },
                  }}
                  className="w-full truncate text-xl font-semibold hover:text-link"
                >
                  {goal.scorer.name}
                </Link>
                <div className="text-xs text-secondary">
                  {!goal.primaryAssist
                    ? 'Unassisted'
                    : `${getPlayerShortname(goal.primaryAssist.name ?? '')}${
                        goal.secondaryAssist !== null
                          ? ', ' +
                            getPlayerShortname(goal.secondaryAssist.name ?? '')
                          : ''
                      }`}
                </div>
                <GoalTimingBar
                  gameData={gameData}
                  goal={goal}
                  period={period}
                />
                {isFHM10 && <ShotQualityBar gameData={gameData} shot={goal} />}
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export const BoxscorePeriodScoring = ({
  league,
  gameData,
  isFHM10,
}: {
  league: League;
  gameData: GamePreviewData | undefined;
  isFHM10: boolean;
}) => {
  const { data } = useQuery<BoxscoreScoring[]>({
    queryKey: [
      `gameBoxscoreScoring`,
      gameData?.game.league,
      gameData?.game.gameid,
    ],
    queryFn: () =>
      query(
        `api/v3/schedule/game/boxscore/scoring?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
      ),
    enabled: !!gameData,
  });

  const periodByPeriodScoring = useMemo(() => {
    const dataWithScores = data?.reduce(
      (acc: BoxscoreGoalWithCurrentScore[], goal, i) => {
        const isHomeScore = goal.teamAbbr === gameData?.teams.home.abbr;

        if (i === 0) {
          return [
            {
              ...goal,
              homeScore: isHomeScore ? 1 : 0,
              awayScore: isHomeScore ? 0 : 1,
            },
          ];
        }

        acc.push({
          ...goal,
          homeScore: acc[i - 1].homeScore + (isHomeScore ? 1 : 0),
          awayScore: acc[i - 1].awayScore + (isHomeScore ? 0 : 1),
        });
        return acc;
      },
      [],
    );
    return groupBy(dataWithScores, 'period');
  }, [data, gameData?.teams.home.abbr]);

  if (!gameData || !data) {
    return (
      <div className="flex h-10 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="ml-4 mt-1 text-sm font-medium text-secondary">
        Scoring
      </div>
      <div className="flex w-full flex-col bg-table-row">
        <PeriodScoringColumn
          league={league}
          data={periodByPeriodScoring[1]}
          gameData={gameData}
          title="1st Period"
          period="1st"
          isFHM10={isFHM10}
        />
        <PeriodScoringColumn
          league={league}
          data={periodByPeriodScoring[2]}
          gameData={gameData}
          title="2nd Period"
          period="2nd"
          isFHM10={isFHM10}
        />
        <PeriodScoringColumn
          league={league}
          data={periodByPeriodScoring[3]}
          gameData={gameData}
          title="3rd Period"
          period="3rd"
          isFHM10={isFHM10}
        />
        {!!gameData.game.overtime && (
          <PeriodScoringColumn
            league={league}
            data={periodByPeriodScoring[0]}
            gameData={gameData}
            title="Overtime"
            period="OT"
            isFHM10={isFHM10}
          />
        )}
        {!!gameData.game.shootout && (
          <PeriodScoringColumn
            league={league}
            data={periodByPeriodScoring[4]}
            gameData={gameData}
            title="Shootout"
            period="SO"
            isFHM10={isFHM10}
          />
        )}
      </div>
    </>
  );
};
