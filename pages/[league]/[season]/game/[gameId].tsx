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

  console.log(data, error);

  if (isLoadingAssets) return null; // TODO

  const renderTeamStats = () => {
    const stats = {
      away: {
        goalsForPerGame: 0,
        goalsAgainstPerGame: 0
      },
      home: {
        goalsForPerGame: 0,
        goalsAgainstPerGame: 0
      }
    };
    Object.keys(data.teamStats).forEach((team) => {
      stats[team] = {
        goalsForPerGame: (data.teamStats[team].goalsFor / data.teamStats[team].gamesPlayed).toFixed(2),
        goalsAgainstPerGame: (data.teamStats[team].goalsAgainst / data.teamStats[team].gamesPlayed).toFixed(2),
      }
    });

    return (
      <>
        <FlexRow>
          {stats.away.goalsForPerGame}
          <span>GF/GP</span>
          {stats.home.goalsForPerGame}
        </FlexRow>
        <FlexRow>
          {stats.away.goalsAgainstPerGame}
          <span>GA/GP</span>
          {stats.home.goalsAgainstPerGame}
        </FlexRow>
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
          <FlexRow>
            <TeamLogoSmall>
              <Sprites.Away />
            </TeamLogoSmall>
            Team Stats
            <TeamLogoSmall>
              <Sprites.Home />
            </TeamLogoSmall>
          </FlexRow>
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
  justify-content: space-evenly;
  background-color: ${({ theme }) => theme.colors.grey100};

  @media screen and (max-width: 1024px) {
    width: 100%;
    padding: 2.5%;
  }
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

const TeamData = styled.div`
  display: flex;
  flex-direction: row;
`;

const TeamLogoSmall = styled.div`
  width: 25px;
  height: 25px;
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
