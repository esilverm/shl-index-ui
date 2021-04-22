// TODO: Add logic to
// * Add error state(s)
// * Hide all preview widgets when game has been played
// * Rename "Season Series" to "Playoff Series" for playoff games
// * Hide Divisional widgets if season type is "Playoffs"
import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';

import Header from '../../../../components/Header';
import { Matchup as MatchupData, GoalieStats } from '../../../api/v1/schedule/game/[gameId]';
import { Standings } from '../../../api/v1/standings';

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

  const renderTeamStats = () => {
    const stats = {
      goalsForPerGame: {
        title: 'GF/GP',
        away: {
          total: 0,
          perc: 0
        },
        home: {
          total: 0,
          perc: 0
        }
      },
      goalsAgainstPerGame: {
        title: 'GA/GP',
        away: {
          total: 0,
          perc: 0
        },
        home: {
          total: 0,
          perc: 0
        }
      }
    };
    const awayColor = gameData.teams.away.primaryColor;
    const homeColor = gameData.teams.home.primaryColor;
    Object.keys(gameData.teamStats).forEach((team) => {
      stats.goalsForPerGame[team].total = parseFloat((gameData.teamStats[team].goalsFor / gameData.teamStats[team].gamesPlayed).toFixed(2));
      stats.goalsAgainstPerGame[team].total = parseFloat((gameData.teamStats[team].goalsAgainst / gameData.teamStats[team].gamesPlayed).toFixed(2));
    });
    stats.goalsForPerGame.away.perc = stats.goalsForPerGame.away.total / (stats.goalsForPerGame.away.total + stats.goalsForPerGame.home.total) * 100;
    stats.goalsAgainstPerGame.away.perc = stats.goalsAgainstPerGame.home.total / (stats.goalsAgainstPerGame.away.total + stats.goalsAgainstPerGame.home.total) * 100;

    return (
      <>
        <TeamStatsRow>
          <StatValue>{stats.goalsForPerGame.away.total}</StatValue>
          <StatTitle>{stats.goalsForPerGame.title}</StatTitle>
          <StatValue home>{stats.goalsForPerGame.home.total}</StatValue>
        </TeamStatsRow>
        <TeamStatsBar awayColor={awayColor} awayPerc={stats.goalsForPerGame.away.perc} homeColor={homeColor} />
        <TeamStatsRow>
          <StatValue>{stats.goalsAgainstPerGame.away.total}</StatValue>
          <StatTitle>{stats.goalsAgainstPerGame.title}</StatTitle>
          <StatValue home>{stats.goalsAgainstPerGame.home.total}</StatValue>
        </TeamStatsRow>
        <TeamStatsBar awayColor={awayColor} awayPerc={stats.goalsAgainstPerGame.away.perc} homeColor={homeColor} />
      </>
    )
  };

  const renderDivisionStandings = () => {
    const isSameDivision = divisions[0].name === divisions[1].name;
    const sortedStandings = [
      {
        name: divisions[0].name,
        teams: divisions[0].teams.sort((a, b) => a.position > b.position ? 1 : -1)
      },
    ];
    if (!isSameDivision) {
      sortedStandings.push({
        name: divisions[1].name,
        teams: divisions[1].teams.sort((a, b) => a.position > b.position ? 1 : -1)
      });
    }

    return sortedStandings.map((divisionStandings) => (
      <DivisionStandings key={divisionStandings.name}>
        <StandingsTableRow>
          <SectionTitle>
            {`${divisionStandings.name} Standings`}
          </SectionTitle>
        </StandingsTableRow>
        <StandingsTable>
          <StandingsTableHeader>
            <StandingsTableCell></StandingsTableCell>
            <StandingsTableCell>PTS</StandingsTableCell>
            <StandingsTableCell>GP</StandingsTableCell>
            <StandingsTableCell>W</StandingsTableCell>
            <StandingsTableCell>L</StandingsTableCell>
            <StandingsTableCell>OT</StandingsTableCell>
          </StandingsTableHeader>
          {divisionStandings.teams.map((team) => {
            const Logo = Sprites[team.abbreviation];
            return (
              <StandingsTableRow key={team.abbreviation}>
                <StandingsTableCell>
                  <TeamInfo>
                    <TeamLogoSmall>
                      <Logo />
                    </TeamLogoSmall>
                    {team.abbreviation}
                  </TeamInfo>
                </StandingsTableCell>
                <StandingsTableCell>{team.points}</StandingsTableCell>
                <StandingsTableCell>{team.gp}</StandingsTableCell>
                <StandingsTableCell>{team.wins}</StandingsTableCell>
                <StandingsTableCell>{team.losses}</StandingsTableCell>
                <StandingsTableCell>{team.OTL}</StandingsTableCell>
              </StandingsTableRow>
            );
          })}
        </StandingsTable>
      </DivisionStandings>
    ));
  };

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
              <TeamStats>
                <TeamStatsHeader>
                  <FlexRow height={50}>
                    <TeamLogoSmall>
                      <Sprites.Away />
                    </TeamLogoSmall>
                    <SectionTitle>
                      Team Stats
                    </SectionTitle>
                    <TeamLogoSmall>
                      <Sprites.Home />
                    </TeamLogoSmall>
                  </FlexRow>
                </TeamStatsHeader>
                {renderTeamStats()}
              </TeamStats>
              {divisionError &&
                <ErrorBlock>
                  Failed to load division standings
                </ErrorBlock>
              }
              {divisionData && renderDivisionStandings()}
            </FlexColumn>
            <Comparison>
              {renderTeamsBlock()}
              {renderSkaterComparison()}
              {renderGoalieComparison()}
            </Comparison>
            <PreviousMatchups>
              <MatchupsHeader>
                <SectionTitle>
                  Season Series
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

const FlexRow = styled.div<{
  height?: number;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: ${({ height }) => height ? `${height}px` : 'auto'}
`;

const FlexColumn = styled.div<{
  width?: number;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ width }) => width ? `${width}px` : '100%'};
  height: fit-content;
`;

const SectionTitle = styled.span`
  font-weight: 600;
`;

// Left
const TeamStats = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 15px;
`;

const TeamStatsHeader = styled.div`
  font-weight: 600;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
`;

const TeamStatsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 15px;
  padding-bottom: 5px;
`;

const TeamStatsBar = styled.div<{
  awayColor: string;
  awayPerc: number;
  homeColor: string;
}>`
  border: 2px solid;
  border-image: ${props => `
    linear-gradient(to right,
      ${props.awayColor} 0%,
      ${props.awayColor} ${props.awayPerc}%,
      ${props.theme.colors.grey100} ${props.awayPerc}%,
      ${props.theme.colors.grey100} ${props.awayPerc+1}%,
      ${props.homeColor} ${props.awayPerc+1}%,
      ${props.homeColor} 100%
    ) 5`};
`;

const DivisionStandings = styled.div`
  background-color: ${({ theme }) => theme.colors.grey100};
  margin-top: 10px;
  padding: 15px 15px 0 15px;
  width: 100%;
`;

const StandingsTable = styled.div`
  display: table;
  width: calc(100% + 30px);
  margin: 15px 0 0 -15px;
`;

const StandingsTableRow = styled.div`
  display: table-row;
  width: 100%;
`;

const StandingsTableCell = styled.div`
  display: table-cell;
  width: 30px;
  height: 40px;
  padding: 5px 0;
  font-family: Montserrat, sans-serif;
  vertical-align: middle;
  text-align: center;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
  font-weight: 600;

  div:first-child {
    margin-right: 5px;
  }
`;

const StandingsTableHeader = styled(StandingsTableRow)`
  background-color: ${({ theme }) => theme.colors.grey300};
  width: calc(100% + 30px);
  left: -15px;
  font-weight: 600;
  height: 40px;
`;

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

const StatTitle = styled.span`
  font-size: 16px;
`;

const StatValue = styled.span<{
  home?: boolean;
}>`
  font-family: Montserrat, sans-serif;
  font-size: 22px;
  font-weight: 700;
  flex: 1;
  ${({ home }) => home && 'text-align: right;'};
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

const TeamLogoSmall = styled.div`
  width: 25px;
  height: 25px;
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
