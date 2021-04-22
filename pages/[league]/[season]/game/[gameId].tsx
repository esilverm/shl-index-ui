// TODO: Add logic to
// * Hide all preview widgets when game has been played
// * Break out widgets into components
import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';

import Header from '../../../../components/Header';
import { DivisionStandings, TeamStats } from '../../../../components/Game';
import { Matchup as MatchupData, GoalieStats } from '../../../api/v1/schedule/game/[gameId]';
import { Standings } from '../../../api/v1/standings';
import { FlexColumn, FlexRow, SectionTitle, TeamLogoSmall } from '../../../../components/Game/common';

interface Props {
  league: string;
  gameId: string;
}

function GameResults({ league, gameId }: Props): JSX.Element {
  const [divisions, setDivisions] = useState<Array<Standings[number]>>();
  const [isLoadingAssets, setLoadingAssets] = useState<boolean>(true);
  const [Sprites, setSprites] = useState<{
    [index: string]: React.ComponentClass<any>;
  }>({});

  const { data: gameData, error: gameError } = useSWR<MatchupData>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/schedule/game/${gameId}`
  );

  const { data: divisionData, error: divisionError } = useSWR<Standings>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/standings?display=division`
  );

  useEffect(() => {
    if (!gameData) return;
    // Dynamically import svg icons based on the league chosen
    (async () => {
      const { default: s } = await import(
        `../../../../public/team_logos/${league.toUpperCase()}/`
      );

      const teamSprites = {
        Away: s[gameData.teams.away.abbr],
        Home: s[gameData.teams.home.abbr]
      };

      setSprites(() => ({
        ...teamSprites,
        ...s
      }));
      setLoadingAssets(() => false);
    })();
  }, [gameData]);

  useEffect(() => {
    if (!divisionData || !gameData || divisions) return;

    const awayDivision = divisionData.find((division) =>
      division.teams.some((team) => team.abbreviation === gameData.teams.away.abbr));
    const homeDivision = divisionData.find((division) =>
      division.teams.some((team) => team.abbreviation === gameData.teams.home.abbr));

    setDivisions([awayDivision, homeDivision]);
  }, [divisionData, gameData, divisions]);

  

  const renderTeamsBlock = () => (
    <TeamsPreview>
      <FlexColumn>
        <GameDate>
          <SectionTitle>
            {gameData.game.date}
          </SectionTitle>
        </GameDate>
        <FlexRow>
          <TeamData>
            <TeamLogo>
              <Sprites.Away />
            </TeamLogo>
            <FlexColumn>
              <TeamName>
                {`${gameData.teams.away.name} ${gameData.teams.away.nickname}`}
              </TeamName>
              <TeamRecord>
                {gameData.teamStats.away.record}
              </TeamRecord>
            </FlexColumn>
          </TeamData>
          <TeamData>
            <FlexColumn>
              <TeamName home>
                {`${gameData.teams.home.name} ${gameData.teams.home.nickname}`}
              </TeamName>
              <TeamRecord home>
                {gameData.teamStats.home.record}
              </TeamRecord>
            </FlexColumn>
            <TeamLogo>
              <Sprites.Home />
            </TeamLogo>
          </TeamData>
        </FlexRow>
      </FlexColumn>
    </TeamsPreview>
  );

  const renderSkaterComparison = () => {
    const defaultStatLeaders = {
      away: {
        player: '',
        value: -99
      },
      home: {
        player: '',
        value: -99
      }
    };
    // Using JSON because the spread and Object.assign operators copied the object with its reference
    const teamLeaders = {
      points: {
        label: 'Points',
        ...JSON.parse(JSON.stringify(defaultStatLeaders))
      },
      goals: {
        label: 'Goals',
        ...JSON.parse(JSON.stringify(defaultStatLeaders))
      },
      assists: {
        label: 'Assists',
        ...JSON.parse(JSON.stringify(defaultStatLeaders))
      },
      plusMinus: {
        label: '+/-',
        ...JSON.parse(JSON.stringify(defaultStatLeaders))
      }
    };

    Object.keys(gameData.skaterStats).forEach((team) => {
      gameData.skaterStats[team].forEach((skater) => {
        const points = skater.goals + skater.assists;
        Object.keys(teamLeaders).forEach((stat) => {
          const skaterValue = stat === 'points' ? points : skater[stat];
          if (skaterValue > teamLeaders[stat][team].value) {
            teamLeaders[stat][team].player = skater.name;
            teamLeaders[stat][team].value = skaterValue;
          }
        });
      });
    });

    return (
      <SkaterComparison>
        <ComparisonHeader>
          <TeamLogoSmall>
            <Sprites.Away />
          </TeamLogoSmall>
          <SectionTitle>
            Players To Watch
          </SectionTitle>
          <TeamLogoSmall>
            <Sprites.Home />
          </TeamLogoSmall>
        </ComparisonHeader>
        <SkaterStats>
          {Object.keys(teamLeaders).map((stat) => (
            <StatComparison key={stat}>
              <TeamLeader>
                <LeaderSkater>{teamLeaders[stat].away.player}</LeaderSkater>
                <LeaderValue gray={teamLeaders[stat].away.value < teamLeaders[stat].home.value}>{teamLeaders[stat].away.value}</LeaderValue>
              </TeamLeader>
              <LeaderLabel>
                {teamLeaders[stat].label}
              </LeaderLabel>
              <TeamLeader home>
                <LeaderValue gray={teamLeaders[stat].home.value < teamLeaders[stat].away.value}>{teamLeaders[stat].home.value}</LeaderValue>
                <LeaderSkater>{teamLeaders[stat].home.player}</LeaderSkater>
              </TeamLeader>
            </StatComparison>
          ))}
        </SkaterStats>
      </SkaterComparison>
    );
  };

  const renderGoalieComparison = () => {
    const sortByGamesPlayed = (goalies: Array<GoalieStats>) => goalies.sort((a, b) => (a.wins + a.losses + a.OT > b.wins + b.losses + b.OT) ? -1 : 1);
    const statLabels = {
      record: 'Record',
      GAA: 'GAA',
      savePct: 'SV%',
      shutouts: 'SO'
    };
    const renderAwayGoalieStats = (team: 'away' | 'home') => Object.values(sortByGamesPlayed(gameData.goalieStats[team])).map((goalie) => (
      <>
        <GoalieName>
          {goalie.name}
        </GoalieName>
        <FlexRow>
          <GoalieStat>
            <span>{statLabels.record}</span>
            <span>{`${goalie.wins}-${goalie.losses}-${goalie.OT}`}</span>
          </GoalieStat>
          {Object.keys(goalie).map((stat) => {
            if (!Object.keys(statLabels).includes(stat)) return null;

            return (
              <GoalieStat key={stat}>
                <span>{statLabels[stat]}</span>
                <span>{goalie[stat]}</span>
              </GoalieStat>
            );
          })}
        </FlexRow>
      </>
    ));

    return (
      <GoalieComparison>
        <ComparisonHeader>
          <TeamLogoSmall>
            <Sprites.Away />
          </TeamLogoSmall>
          <SectionTitle>
            Goaltender Comparison
          </SectionTitle>
          <TeamLogoSmall>
            <Sprites.Home />
          </TeamLogoSmall>
        </ComparisonHeader>
        <GoalieStatsBlock>
          <TeamGoalies>
            {renderAwayGoalieStats('away')}
          </TeamGoalies>
          <TeamGoalies home>
            {renderAwayGoalieStats('home')}
          </TeamGoalies>
        </GoalieStatsBlock>
      </GoalieComparison>
    );
  };

  const renderPreviousMatchups = () => gameData.previousMatchups.map((matchup) => (
    <Matchup key={matchup.slug}>
      <SectionTitle>
        {matchup.date}
      </SectionTitle>
      <MatchupTeamRow>
        <TeamLogoSmall>
          {matchup.awayTeam === gameData.game.awayTeam ? <Sprites.Away /> : <Sprites.Home />}
        </TeamLogoSmall>
        <span>{matchup.awayTeam === gameData.game.awayTeam ? gameData.teams.away.nickname : gameData.teams.home.nickname}</span>
        <MatchupRowScore lost={matchup.awayScore < matchup.homeScore}>{matchup.awayScore}</MatchupRowScore>
      </MatchupTeamRow>
      <MatchupTeamRow>
        <TeamLogoSmall>
          {matchup.homeTeam === gameData.game.homeTeam ? <Sprites.Home /> : <Sprites.Away />}
        </TeamLogoSmall>
        <span>{matchup.homeTeam === gameData.game.homeTeam ? gameData.teams.home.nickname : gameData.teams.away.nickname}</span>
        <MatchupRowScore lost={matchup.homeScore < matchup.awayScore}>{matchup.homeScore}</MatchupRowScore>
      </MatchupTeamRow>
    </Matchup>
  ));

  const isLoading = isLoadingAssets || !gameData;
  const isRegularSeason = gameData && gameData.game.type === "Regular Season";

  return (
    <React.Fragment>
      <NextSeo
        title='Game'
        openGraph={{
          title: 'Game',
        }}
      />
      <Header league={league} />
      <Container>
        {gameError &&
          <ErrorBlock>
            Failed to load game preview. Please reload the page to try again.
          </ErrorBlock>
        }
        {isLoading && !gameError && <PulseLoader size={15} />}
        {!isLoading && (
          <>
            <FlexColumn width={300}>
              <TeamStats gameData={gameData} Sprites={Sprites} />
              {isRegularSeason && divisionError &&
                <ErrorBlock>
                  Failed to load division standings
                </ErrorBlock>
              }
              {isRegularSeason && divisions && <DivisionStandings divisions={divisions} Sprites={Sprites} />}
            </FlexColumn>
            <Comparison>
              {renderTeamsBlock()}
              {renderSkaterComparison()}
              {renderGoalieComparison()}
            </Comparison>
            <PreviousMatchups>
              <MatchupsHeader>
                <SectionTitle>
                  {`${gameData.game.type} Series`}
                </SectionTitle>
              </MatchupsHeader>
              {gameData.previousMatchups.length > 0 && renderPreviousMatchups()}
              {gameData.previousMatchups.length === 0 && (
                <Matchup>
                  <div>
                    No previous games played
                  </div>
                </Matchup>
              )}
            </PreviousMatchups>
          </>
        )}
      </Container>
    </React.Fragment>
  );
}

const Container = styled.div`
  width: 65%;
  padding: 41px 0 40px 0;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-evenly;

  @media screen and (max-width: 1024px) {
    width: 100%;
    padding: 2.5%;
  }
`;

// Left


// Middle
const Comparison = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 20px;
`;

const TeamsPreview = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 0 15px 15px 15px;
`;

const TeamData = styled.div`
  display: flex;
  flex-direction: row;
`;

const GameDate = styled.div`
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 4px solid ${({ theme }) => theme.colors.grey300};
  margin-bottom: 10px;
  padding 10px 0;
`;

const TeamName = styled.span<{
  home?: boolean;
}>`
  text-align: ${({ home }) => home ? 'right' : 'left'};
  padding: 0 10px;
  font-weight: 600;
`;

const TeamRecord = styled.span<{
  home?: boolean;
}>`
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  text-align: ${({ home }) => home ? 'right' : 'left'};
  padding: 0 10px;
  color: ${({ theme }) => theme.colors.grey600};
`;

const TeamLogo = styled.div`
  width: 50px;
  height: 50px;
`;

const SkaterComparison = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 15px;
  margin-top: 10px;
`;

const ComparisonHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
  padding-bottom: 15px;
`;

const SkaterStats = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StatComparison = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  align-items: center;
`;

const TeamLeader = styled.div<{
  home?: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  text-align: ${({ home }) => home ? 'right' : 'left'};
  margin-${({ home }) => home ? 'left' : 'right'}: 10px;
`;

const LeaderSkater = styled.span`
  font-weight: 600;
`;

const LeaderValue = styled.span<{
  gray?: boolean;
}>`
  font-size: 32px;
  font-weight: 700;
  font-family: Montserrat, sans-serif;
  ${({ gray, theme }) => gray && `color: ${theme.colors.grey500};`};
`;

const LeaderLabel = styled.span`
  width: 75px;
  font-size: 14px;
  text-align: center;
`;

const GoalieComparison = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 15px;
  margin-top: 10px;
`;

const GoalieStatsBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TeamGoalies = styled.div<{
  home?: boolean;
}>`
  display: flex;
  flex-direction: column;
  width: 200px;
  ${({ home }) => home && `text-align: right;`}
`;

const GoalieName = styled.span`
  font-weight: 600;
  margin-top: 15px;
`;

const GoalieStat = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grey600};

  span:last-child {
    font-weight: 600;
  }
`;

// Right
const PreviousMatchups = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 0 15px;
  width: 300px;

  div:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const MatchupTeamRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  font-weight: 600;

  div:first-child {
    margin-right: 10px;
  }
`;

const MatchupRowScore = styled.span<{
  lost?: boolean;
}>`
  ${({ lost, theme }) => lost && `color: ${theme.colors.grey500};`};
  font-family: Montserrat, sans-serif;
  margin-left: auto;
  font-size: 16px;
`;

const MatchupsHeader = styled.div`
  font-weight: 600;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
  margin-bottom: 10px;
  padding: 10px 0;
`;

const Matchup = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};

  * {
    padding-bottom: 5px;
  }

  span:first-child {
    font-family: Montserrat, sans-serif;
    font-size: 14px;
    margin-bottom: 10px;
  }
`;

// Error
const ErrorBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.red200};
  height: 50px;
  padding: 10px;
  margin: 10px 0;
  font-weight: 500;
`;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { league, gameId } = params;
  return { props: { league, gameId } };
}

export default GameResults;
