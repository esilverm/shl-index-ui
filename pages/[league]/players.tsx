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
import SearchBar from '../../components/SearchBar/SearchBar'
import searchBarFilterPlayerStats from '../../components/SearchBar/searchBarFilterPlayerStats'
import searchBarFilterPlayerRatings from '../../components/SearchBar/searchBarFilterPlayerRatings'
import { PlayerRatings, GoalieRatings, Player, Goalie } from '../..';
import SeasonTypeSelector from '../../components/Selector/SeasonTypeSelector';
import { SeasonType } from '../api/v1/players/stats';

interface Props {
  league: string;
  leaguename: string;
}

function PlayerPage({ league }: Props): JSX.Element {
  const { ratings: skaterratings, isLoading: isLoadingPlayers } = useRatings(
    league
  );
  const [filterSeasonType, setFilterSeasonType] = useState('Regular Season');
  const { ratings: skater, isLoading: isLoadingPlayerStat } = useSkaterStats(
    league,
    filterSeasonType
  );
  const { ratings: goalie } = useGoalieStats(league, filterSeasonType);

  const {
    ratings: goalieratingdata,
    isLoading: isLoadingGoalies,
  } = useGoalieRatings(league);

  const [searchText, setSearchText] = useState('')

  const updateSearchText = (text) => {
    setSearchText(text)
  }

  const { players: filteredPlayerRatings, goalies: filteredGoalieRatings } = searchBarFilterPlayerRatings(
    {searchText: String(searchText), players: skaterratings, goalies: goalieratingdata})

  const getSkaters = () =>
    filteredPlayerRatings
      ? (skaterratings.filter(
          (player) => player.position !== 'G'
        ) as Array<PlayerRatings>)
      : [];

  const getGoalies = () =>
    filteredGoalieRatings
      ? (goalieratingdata.filter(
          (player) => player.position === 'G'
        ) as Array<GoalieRatings>)
      : [];

  const { players: filteredSkaters, goalies: filteredGoalies } = searchBarFilterPlayerStats(
    {searchText: String(searchText), players: skater, goalies: goalie})
  
  const getSkater = () =>
    filteredSkaters
      ? (filteredSkaters.filter((player) => player.position !== 'G') as Array<Player>)
      : [];

  const getGoalie = () =>
    filteredGoalies
      ? (filteredGoalies.filter((player) => player.position === 'G') as Array<Goalie>)
      : [];

  const [display, setDisplay] = useState('stats');

  const onSeasonTypeSelect = async (seasonType: SeasonType) => {
    setFilterSeasonType(seasonType);
  };

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
        <SearchBar updateSearchText={updateSearchText}/>
        <Filters>
          <SelectorWrapper>
            <SeasonTypeSelector onChange={onSeasonTypeSelect} />
          </SelectorWrapper>
          <DisplaySelectContainer role="tablist">
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
            <DisplaySelectItem
              onClick={() => setDisplay(() => 'ratings')}
              active={display === 'ratings'}
              tabIndex={0}
              role="tab"
              aria-selected={display === 'ratings'}
            >
              Ratings
            </DisplaySelectItem>
          </DisplaySelectContainer>
        </Filters>
        <Main>
          <TableHeading>Skaters</TableHeading>
          <TableWrapper>
            <TableContainer>
              {display === 'ratings' && !isLoadingPlayers ? (
                <SkaterRatingsTable data={getSkaters()} pagination/>
              ) : display === 'stats' && !isLoadingPlayerStat ? (
                <SkaterScoreTable data={getSkater()} pagination />
              ) : (
                <SkaterAdvStatsTable data={getSkater()} pagination />
              )}
            </TableContainer>
          </TableWrapper>
          <TableHeading>Goalies</TableHeading>
          <TableWrapper>
            {!isLoadingGoalies && (
              <TableContainer>
                {display === 'ratings' && !isLoadingGoalies ? (
                  <GoalieRatingsTable data={getGoalies()} pagination/>
                ) : (
                  <GoalieScoreTable data={getGoalie()} pagination />
                )}
              </TableContainer>
            )}
          </TableWrapper>
        </Main>
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

const Main = styled.main`
  height: 100%;
  width: 100%;
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

const Filters = styled.div`
  @media screen and (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      margin-right: 0;
      margin-bottom: 5px;
    }
  }

  @media screen and (max-width: 750px) {
    flex-direction: column;
    align-items: center;

    button {
      margin-right: 0;
      margin-bottom: 5px;
    }
  }
`;

const SelectorWrapper = styled.div`
  width: 250px;
  float: right;
  margin-right: 3%;
`;

const SearchBarWrapper = styled.div`
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  padding: 5px 50px 5px 5px;
`;
