import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';

import Header from '../../../../components/Header';
import { DivisionStandings, GoalieComparison, PreviousMatchups, SkaterComparison, TeamsBlock, TeamStats } from '../../../../components/Game';
import { Matchup as MatchupData } from '../../../api/v1/schedule/game/[gameId]';
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

  const renderDivisionStandings = () => {
    if (!divisions && !divisionError) {
      return (
        <CenteredContent>
          <PulseLoader size={15} />
        </CenteredContent>
      );
    }

    if (divisionError) {
      return (
        <ErrorBlock>
          Failed to load division standings
        </ErrorBlock>
      );
    }

    if (divisions) {
      return <DivisionStandings divisions={divisions} Sprites={Sprites} />;
    }
  };

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
            <LeftColumn>
              <TeamStats gameData={gameData} Sprites={Sprites} />
              {isRegularSeason && renderDivisionStandings()}
            </LeftColumn>
            <MiddleColumn>
              <TeamsBlock gameData={gameData} Sprites={Sprites} />
              <SkaterComparison gameData={gameData} Sprites={Sprites} />
              <GoalieComparison gameData={gameData} Sprites={Sprites} />
            </MiddleColumn>
            <RightColumn>
              <PreviousMatchups gameData={gameData} Sprites={Sprites} />
            </RightColumn>
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

  @media screen and (max-width: 1650px) {
    width: 75%;
    padding: 21px 0 40px 0;
  }

  @media screen and (max-width: 1550px) {
    width: 85%;
  }

  @media screen and (max-width: 1400px) {
    width: 95%;
  }

  @media screen and (max-width: 1200px) {
    display: grid;
    grid-template-columns: 300px auto;
    grid-template-areas:
      'stats teams'
      'matchups teams';
    justify-content: normal;
  }

  @media screen and (max-width: 900px) {
    grid-template-columns: 300px auto 300px;
    grid-template-areas:
      'teams teams teams'
      'stats . matchups';
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 100%;
    grid-template-areas:
      'teams'
      'stats'
      'matchups';
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  height: fit-content;

  @media screen and (max-width: 1200px) {
    grid-area: stats;
  }

  @media screen and (max-width: 900px) {
    margin-top: 10px;
  }

  @media screen and (max-width: 670px) {
    width: 100%;
  }
`;

const MiddleColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 20px;

  @media screen and (max-width: 1200px) {
    grid-area: teams;
    margin: 0 0 0 20px;
  }

  @media screen and (max-width: 900px) {
    margin: 0
  }
`;

const RightColumn = styled.div`
  width: 300px;

  @media screen and (max-width: 1200px) {
    grid-area: matchups;
    margin-top: 10px;
  }

  @media screen and (max-width: 670px) {
    width: 100%;
  }
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

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
