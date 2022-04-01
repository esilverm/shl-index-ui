/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';
import styled from 'styled-components';

// import useSWR from 'swr';
import { Player, Goalie } from '../..';
import GoalieScoreTable from '../../components/STHS/GoalieScoreTable';
import Layout from '../../components/STHS/Layout';
import SkaterScoreTable from '../../components/STHS/SkaterScoreTable';
import useGoalieStats from '../../hooks/useGoalieStats';
import useSkaterStats from '../../hooks/useSkaterStats';
interface Props {
  league: string;
  leaguename: string;
}

function PlayerPage({ league }: Props): JSX.Element {
  const { ratings: skater, isLoading: isLoadingPlayers } = useSkaterStats(
    league,
    'Regular Season'
  );
  const { ratings: goalie, isLoading: isLoadingGoalies } = useGoalieStats(
    league,
    'Regular Season'
  );

  // get top 75 skaters in points
  const getSkater = () =>
    skater
      ? (skater
          .filter((player) => player.position !== 'G')
          .sort((a, b) => b.points - a.points)
          .slice(0, 75) as Array<Player>)
      : [];

  const getGoalie = () =>
    goalie
      ? (goalie
          .filter((player) => player.position === 'G')
          .sort((a, b) => b.wins - a.wins)
          .slice(0, 15) as Array<Goalie>)
      : [];

  return (
    <React.Fragment>
      <NextSeo
        title="Players"
        openGraph={{
          title: 'Players',
        }}
      />
      <Layout league={league} activePage="Pro League">
        <Container>
          <Main>
            <TableHeading>Pro Leaders</TableHeading>
            <PageSizeWarning>
              Your browser screen resolution is too small for this page. Some
              information are hidden to keep the page readable.
            </PageSizeWarning>
            <TableWrapper>
              <TableContainer>
                {!isLoadingPlayers && (
                  <SkaterScoreTable data={getSkater()} leadersPage />
                )}
              </TableContainer>
            </TableWrapper>

            <TableWrapper>
              <TableContainer>
                {!isLoadingGoalies && (
                  <GoalieScoreTable data={getGoalie()} leadersPage />
                )}
              </TableContainer>
            </TableWrapper>
          </Main>
        </Container>
      </Layout>
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
  padding: 1px 0 40px 0;
  margin: 0 auto;
`;

const TableWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

const TableContainer = styled.div`
  width: 100%;
  margin: 30px 0;
`;

const TableHeading = styled.h2`
  text-align: left;
  font-weight: bold;
  font-size: 1.6em;
  padding-bottom 9px;
  padding-left: 9px;
`;

const Main = styled.main`
  height: 100%;
  width: 100%;
`;

const PageSizeWarning = styled.div`
  display: none;
  color: #ff0000;
  font-weight: bold;
  padding: 1px 1px 1px 5px;
  text-align: center;

  @media screen and (max-width: 1060px) {
    display: block;
  }
`;
