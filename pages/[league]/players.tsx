/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import styled from 'styled-components';
import { NextSeo } from 'next-seo';

// import useSWR from 'swr';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useRatings from '../../hooks/useRatings';
import useGoalieRatings from '../../hooks/useGoalieRatings';
import SkaterRatingsTable from '../../components/RatingsTable/SkaterRatingsTable';
import GoalieRatingsTable from '../../components/RatingsTable/GoalieRatingsTable';
import { PlayerRatings, GoalieRatings } from '../..';

interface Props {
  league: string;
  leaguename: string;
}

function PlayerPage({ league }: Props): JSX.Element {
  const { ratings: skaterratings, isLoading: isLoadingPlayers } = useRatings(
    league
  );
  const {
    ratings: goalieratingdata,
    isLoading: isLoadingGoalies,
  } = useGoalieRatings(league);
  if (!isLoadingPlayers && !isLoadingGoalies)
    console.log(skaterratings, goalieratingdata);

  const getSkaters = () =>
    skaterratings
      ? (skaterratings.filter(
          (player) => player.position !== 'G'
        ) as Array<PlayerRatings>)
      : [];

  const getGoalies = () =>
    goalieratingdata
      ? (goalieratingdata.filter(
          (player) => player.position === 'G'
        ) as Array<GoalieRatings>)
      : [];

  return (
    <React.Fragment>
      <NextSeo
        title="Players"
        openGraph={{
          title: 'Players',
        }}
      />
      <Header league={league} activePage="players" />
      <Container>
        {/* Data for this page that we can also do: Roster, Historical Stats, etc. */}
        <TableHeading>Skaters</TableHeading>
        <TableWrapper>
          {!isLoadingPlayers && (
            <TableContainer>
              <SkaterRatingsTable data={getSkaters()} />
            </TableContainer>
          )}
        </TableWrapper>
        <TableHeading>Goalies</TableHeading>
        <TableWrapper>
          {!isLoadingGoalies && (
            <TableContainer>
              <GoalieRatingsTable data={getGoalies()} />
            </TableContainer>
          )}
        </TableWrapper>
      </Container>
      <Footer />
    </React.Fragment>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];

  const paths = leagues.map((league) => ({
    params: { league },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return { props: { league: ctx.params.league } };
};

export default PlayerPage;

// TODO Add better styling
const Container = styled.div`
  width: 75%;
  padding: 1px 0 40px 0;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.grey100};

  @media screen and (max-width: 1024px) {
    width: 100%;
    padding: 2.5%;
  }
`;

const TableWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

const TableContainer = styled.div`
  width: 100%;
  margin: 30px 0;
`;

const TableHeading = styled.h2`
  width: 95%;
  margin: 30px auto;
  font-size: 2.2rem;
  padding: 5px 0;
  border-bottom: 1px solid black;
`;
