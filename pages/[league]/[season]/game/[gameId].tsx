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
import { DivisionStandings, GoalieComparison, SkaterComparison, TeamsBlock, TeamStats } from '../../../../components/Game';
import { Matchup as MatchupData } from '../../../api/v1/schedule/game/[gameId]';
import { Standings } from '../../../api/v1/standings';
import { FlexColumn, SectionTitle, TeamLogoSmall } from '../../../../components/Game/common';

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
              <TeamsBlock gameData={gameData} Sprites={Sprites} />
              <SkaterComparison gameData={gameData} Sprites={Sprites} />
              <GoalieComparison gameData={gameData} Sprites={Sprites} />
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
