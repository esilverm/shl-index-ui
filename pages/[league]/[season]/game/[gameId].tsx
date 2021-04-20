import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';
import styled from 'styled-components';

import Header from '../../../../components/Header';
import { Matchup as MatchupData } from '../../../api/v1/schedule/game/[gameId]';

interface Props {
  league: string;
  gameId: string;
}

function GameResults({ league, gameId }: Props): JSX.Element {
  const [isLoadingAssets, setLoadingAssets] = useState<boolean>(true);
  const [Sprites, setSprites] = useState<{
    [index: string]: React.ComponentClass<any>;
  }>({});

  const { data, error } = useSWR<MatchupData>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/schedule/game/${gameId}`
  );

  useEffect(() => {
    if (!data) return;
    console.log(data);
    // Dynamically import svg icons based on the league chosen
    (async () => {
      const { default: s } = await import(
        `../../../../public/team_logos/${league.toUpperCase()}/`
      );

      const teamSprites = {
        Away: s[data.teams.away.abbr],
        Home: s[data.teams.home.abbr]
      };

      setSprites(() => teamSprites);
      setLoadingAssets(() => false);
    })();
  }, [data]);

  console.log(data, error); // TODO

  if (isLoadingAssets) return null; // TODO

  const renderTeamStats = () => {
    const stats = {
      goalsForPerGame: {
        title: "GF/GP",
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
        title: "GA/GP",
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
    const awayColor = data.teams.away.primaryColor;
    const homeColor = data.teams.home.primaryColor;
    Object.keys(data.teamStats).forEach((team) => {
      stats.goalsForPerGame[team].total = parseFloat((data.teamStats[team].goalsFor / data.teamStats[team].gamesPlayed).toFixed(2));
      stats.goalsAgainstPerGame[team].total = parseFloat((data.teamStats[team].goalsAgainst / data.teamStats[team].gamesPlayed).toFixed(2));
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

  const renderPreviousMatchups = () => data.previousMatchups.map((matchup) => (
    <Matchup key={matchup.slug}>
      <SectionTitle>
        {matchup.date}
      </SectionTitle>
      <MatchupTeamRow>
        <TeamLogoSmall>
          {matchup.awayTeam === data.game.awayTeam ? <Sprites.Away /> : <Sprites.Home />}
        </TeamLogoSmall>
        <span>{matchup.awayTeam === data.game.awayTeam ? data.teams.away.nickname : data.teams.home.nickname}</span>
        <MatchupRowScore lost={matchup.awayScore < matchup.homeScore}>{matchup.awayScore}</MatchupRowScore>
      </MatchupTeamRow>
      <MatchupTeamRow>
        <TeamLogoSmall>
          {matchup.homeTeam === data.game.homeTeam ? <Sprites.Home /> : <Sprites.Away />}
        </TeamLogoSmall>
        <span>{matchup.homeTeam === data.game.homeTeam ? data.teams.home.nickname : data.teams.away.nickname}</span>
        <MatchupRowScore lost={matchup.homeScore < matchup.awayScore}>{matchup.homeScore}</MatchupRowScore>
      </MatchupTeamRow>
    </Matchup>
  ));

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
        <Comparison>
          <Result>
            <FlexColumn>
              <GameDate>
                <SectionTitle>
                  {data.game.date}
                </SectionTitle>
              </GameDate>
              <FlexRow>
                <TeamData>
                  <TeamLogo>
                    <Sprites.Away />
                  </TeamLogo>
                  <FlexColumn>
                    <TeamName>
                      {`${data.teams.away.name} ${data.teams.away.nickname}`}
                    </TeamName>
                    <TeamRecord>
                      {data.teamStats.away.record}
                    </TeamRecord>
                  </FlexColumn>
                </TeamData>
                <TeamData>
                  <FlexColumn>
                    <TeamName home>
                      {`${data.teams.home.name} ${data.teams.home.nickname}`}
                    </TeamName>
                    <TeamRecord home>
                      {data.teamStats.home.record}
                    </TeamRecord>
                  </FlexColumn>
                  <TeamLogo>
                    <Sprites.Home />
                  </TeamLogo>
                </TeamData>
              </FlexRow>
            </FlexColumn>
          </Result>
        </Comparison>
        <PreviousMatchups>
          <MatchupsHeader>
            <SectionTitle>
              Season Series
            </SectionTitle>
          </MatchupsHeader>
          {renderPreviousMatchups()}
        </PreviousMatchups>
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

const FlexRow = styled.div<{ height?: number; }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: ${({ height }) => height ? `${height}px` : 'auto'}
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
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
  width: 300px;
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

// Middle
const Comparison = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 0 15px 15px 15px;
  flex: 1;
  margin: 0 20px;
`;

const Result = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
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

// Component?
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { league, gameId } = params;
  return { props: { league, gameId } };
}

export default GameResults;
