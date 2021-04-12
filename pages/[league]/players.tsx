/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import styled from 'styled-components';
import { NextSeo } from 'next-seo';

// import useSWR from 'swr';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useRatings from '../../hooks/useRatings';
import useSkaterStats from '../../hooks/useSkaterStats';
import useGoalieStats from '../../hooks/useGoalieStats';
import useGoalieRatings from '../../hooks/useGoalieRatings';
import SkaterRatingsTable from '../../components/RatingsTable/SkaterRatingsTable';
import GoalieRatingsTable from '../../components/RatingsTable/GoalieRatingsTable';
import SkaterAdvStatsTable from '../../components/ScoreTable/SkaterAdvStatsTable';
import SkaterScoreTable from '../../components/ScoreTable/SkaterScoreTable';
import GoalieScoreTable from '../../components/ScoreTable/GoalieScoreTable';
import { PlayerRatings, GoalieRatings, Player, Goalie } from '../..';

interface Props {
  league: string;
  leaguename: string;
}

function PlayerPage({ league }: Props): JSX.Element {
  const { ratings: skaterratings, isLoading: isLoadingPlayers } = useRatings( league );
  const { ratings: skater, isLoading: isLoadingPlayerStat } = useSkaterStats( league );
  const { ratings: goalie, isLoading: isLoadingGoalieStat } = useGoalieStats( league );

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
  
  const getSkater = () =>
  skater
    ? (skater.filter(
        (player) => player.position !== 'G'
      ) as Array<Player>)
    : [];

  const getGoalie = () =>
  goalie
    ? (goalie.filter(
        (player) => player.position !== 'G'
      ) as Array<Goalie>)
    : [];
  
      const [display, setDisplay] = useState('ratings');
  
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
        <DisplaySelectContainer role="tablist">
          <DisplaySelectItem
            onClick={() => setDisplay(() => 'ratings')}
            active={display === 'ratings'}
            tabIndex={0}
            role="tab"
            aria-selected={display === 'ratings'}
          >
            Ratings
          </DisplaySelectItem>
          <DisplaySelectItem
            onClick={() => setDisplay(() => 'stats')}
            active={display === 'stats'}
            tabIndex={0}
            role="tab"
            aria-selected={display === 'stats'}
          >
            Stats
          </DisplaySelectItem>
          <DisplaySelectItem
            onClick={() => setDisplay(() => '')}
            active={display === ''}
            tabIndex={0}
            role="tab"
            aria-selected={display === ''}
          >
            Adv Stats
          </DisplaySelectItem>
        </DisplaySelectContainer>
        <TableHeading>Skaters</TableHeading>
        <TableWrapper>
          {!isLoadingPlayers && (
            <TableContainer>
              {
                display === 'ratings' ? (
                  <SkaterRatingsTable data={getSkaters()} />
                ) : display === 'stats' ? (
                  <SkaterScoreTable data={getSkater()} />
                ) : (
                  <SkaterAdvStatsTable data={getSkater()} />
                )
              }
            </TableContainer>
          )}
        </TableWrapper>
        <TableHeading>Goalies</TableHeading>
        <TableWrapper>
          {!isLoadingGoalies && (
            <TableContainer>
              {
                display === 'ratings' ? (
                  <GoalieRatingsTable data={getGoalies()} />
                ) : (
                  <GoalieScoreTable data={getGoalie()} />
                )
              }
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

const DisplaySelectContainer = styled.div`
  margin: 28px auto;
  width: 95%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
`;

const DisplaySelectItem = styled.div<{ active: boolean }>`
  display: inline-block;
  padding: 8px 24px;
  border: 1px solid
    ${({ theme, active }) => (active ? theme.colors.grey500 : 'transparent')};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.grey100 : 'transparent'};
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  position: relative;
  border-bottom: none;
  bottom: -1px;
`;
