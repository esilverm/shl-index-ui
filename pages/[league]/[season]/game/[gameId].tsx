import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';
import styled from 'styled-components';

import Header from '../../../../components/Header';
import { Matchup as MatchupData } from '../../../api/v1/schedule/[gameId]';

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
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/schedule/${gameId}`
  );

  useEffect(() => {
    if (!data) return;

    // Dynamically import svg icons based on the league chosen
    (async () => {
      const { default: s } = await import(
        `../../../../public/team_logos/${league.toUpperCase()}/`
      );

      const teamSprites = {
        Away: s[data.teams.away.Abbr],
        Home: s[data.teams.home.Abbr]
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
    const awayColor = data.teams.away.PrimaryColor;
    const homeColor = data.teams.home.PrimaryColor;
    Object.keys(data.teamStats).forEach((team) => {
      stats.goalsForPerGame[team].total = parseFloat((data.teamStats[team].goalsFor / data.teamStats[team].gamesPlayed).toFixed(2));
      stats.goalsAgainstPerGame[team].total = parseFloat((data.teamStats[team].goalsAgainst / data.teamStats[team].gamesPlayed).toFixed(2));
    });
    stats.goalsForPerGame.away.perc = stats.goalsForPerGame.away.total / (stats.goalsForPerGame.away.total + stats.goalsForPerGame.home.total) * 100;
    stats.goalsAgainstPerGame.away.perc = stats.goalsAgainstPerGame.home.total / (stats.goalsAgainstPerGame.away.total + stats.goalsAgainstPerGame.home.total) * 100;

    return (
      <>
        <TeamStatsRow>
          <FlexRow>
            <StatValue>{stats.goalsForPerGame.away.total}</StatValue>
            <StatTitle>{stats.goalsForPerGame.title}</StatTitle>
            <StatValue>{stats.goalsForPerGame.home.total}</StatValue>
          </FlexRow>
          <TeamStatsBar awayColor={awayColor} awayPerc={stats.goalsForPerGame.away.perc} homeColor={homeColor} />
        </TeamStatsRow>
        <TeamStatsRow>
          <FlexRow>
            <StatValue>{stats.goalsAgainstPerGame.away.total}</StatValue>
            <StatTitle>{stats.goalsAgainstPerGame.title}</StatTitle>
            <StatValue>{stats.goalsAgainstPerGame.home.total}</StatValue>
          </FlexRow>
          <TeamStatsBar awayColor={awayColor} awayPerc={stats.goalsAgainstPerGame.away.perc} homeColor={homeColor} />
        </TeamStatsRow>
      </>
    )
  };

  const renderPreviousMatchups = () => data.previousMatchups.map((matchup) => (
    <Matchup key={matchup.Slug}>
      <span>{matchup.Date}</span>
      <FlexRow>
        <TeamLogoSmall>
          {matchup.Away === data.game.Away ? <Sprites.Away /> : <Sprites.Home />}
        </TeamLogoSmall>
        <span>{matchup.Away === data.game.Away ? data.teams.away.Nickname : data.teams.home.Nickname}</span>
        <span>{matchup.AwayScore}</span>
      </FlexRow>
      <FlexRow>
        <TeamLogoSmall>
          {matchup.Home === data.game.Home ? <Sprites.Home /> : <Sprites.Away />}
        </TeamLogoSmall>
        <span>{matchup.Home === data.game.Home ? data.teams.home.Nickname : data.teams.away.Nickname}</span>
        <span>{matchup.HomeScore}</span>
      </FlexRow>
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
              <strong>Team Stats</strong>
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
              {data.game.Date}
              <FlexRow>
                <TeamData>
                  <TeamLogo>
                    <Sprites.Away />
                  </TeamLogo>
                  <FlexColumn>
                    <TeamName>
                      {`${data.teams.away.Name} ${data.teams.away.Nickname}`}
                    </TeamName>
                    <TeamRecord>
                      {data.teamStats.away.record}
                    </TeamRecord>
                  </FlexColumn>
                </TeamData>
                <TeamData>
                  <FlexColumn>
                    <TeamName>
                      {`${data.teams.home.Name} ${data.teams.home.Nickname}`}
                    </TeamName>
                    <TeamRecord>
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
          Previous Matchups
          {renderPreviousMatchups()}
        </PreviousMatchups>
      </Container>
    </React.Fragment>
  );
}

const Container = styled.div`
  width: 75%;
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
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
`;

const TeamStatsRow = styled.div`
  padding: 15px 0;
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
`;

const Result = styled.div`
  display: flex;
  flex-direction: row;
`;

const StatTitle = styled.span`
  font-size: 16px;
`;

const StatValue = styled.span`
  font-family: Montserrat, sans-serif;
  font-size: 22px;
  font-weight: 700;
`;

const TeamData = styled.div`
  display: flex;
  flex-direction: row;
`;

const TeamLogoSmall = styled.div`
  width: 30px;
  height: 30px;
`;

const TeamLogo = styled.div`
  width: 40px;
  height: 40px;
`;

const TeamName = styled.span`

`;

const TeamRecord = styled.span`

`;

// Right
const PreviousMatchups = styled.div`
  display: flex;
  flex-direction: column;
`;

// Component?
const Matchup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { league, gameId } = params;
  return { props: { league, gameId } };
}

export default GameResults;
