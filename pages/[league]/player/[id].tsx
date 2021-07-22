import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import React, { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import styled from 'styled-components';

import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import SeasonTypeSelector from '../../../components/Selector/SeasonTypeSelector';
import SingleGoalieRatingsTable from '../../../components/SingleRatingsTable/SingleGoalieRatingsTable';
import SinglePlayerRatingsTable from '../../../components/SingleRatingsTable/SingleSkaterRatingsTable';
import SingleGoalieScoreTable from '../../../components/SingleScoreTable/SingleGoalieScoreTable';
import SingleSkaterAdvStatsTable from '../../../components/SingleScoreTable/SingleSkaterAdvStatsTable';
import SingleSkaterScoreTable from '../../../components/SingleScoreTable/SingleSkaterScoreTable';
import useGoalieRatingsId from '../../../hooks/useGoalieRatingsId';
import useGoalieStatsId from '../../../hooks/useGoalieStatsId';
import useRatingsId from '../../../hooks/useRatingsId';
import useSkaterStatsId from '../../../hooks/useSkaterStatsId';
import { SeasonType } from '../../api/v1/players/stats';

interface Props {
  league: string;
  id: number;
}
function PlayerPage({ league, id }: Props): JSX.Element {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSkater, setIsSkater] = useState<boolean>(true);
  const [playerError, setPlayerError] = useState<boolean>(false);
  const [filterSeasonType, setFilterSeasonType] = useState('Regular Season');

  // player info
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [playerTeam, setPlayerTeam] = useState('');

  // ratings
  const {
    ratings: goalieRatings,
    isLoading: isLoadingGoalieRating,
    isError: isErrorGoalieRating,
  } = useGoalieRatingsId(id, league);

  const {
    ratings: skaterRatings,
    isLoading: isLoadingPlayerRating,
    isError: isErrorPlayerRating,
  } = useRatingsId(id, league);

  // stats
  const {
    ratings: goalieStats,
    isLoading: isLoadingGoalieStats,
    isError: isErrorGoalieStats,
  } = useGoalieStatsId(id, league, filterSeasonType);

  const {
    ratings: skaterStats,
    isLoading: isLoadingSkaterStats,
    isError: isErrorSkaterStats,
  } = useSkaterStatsId(id, league, filterSeasonType);

  // wait for all loads to complete
  useEffect(() => {
    setIsLoading(isLoadingGoalieRating || isLoadingPlayerRating || isLoadingGoalieStats
      || isLoadingSkaterStats);
    if (!isLoading) {
      if (isErrorGoalieRating || isErrorPlayerRating || isErrorGoalieStats
        || isErrorSkaterStats) {
        setPlayerError(true);
      } else {
        if (skaterStats !== undefined) {
          if (skaterStats.length > 0) {
            setIsSkater(true);
            setPlayerName(skaterStats[0].name);
            setPlayerPosition(skaterStats[0].position);
            setPlayerTeam(skaterStats[0].team.toString());
          } else {
            setIsSkater(false);
            setPlayerName(goalieStats[0].name);
            setPlayerPosition('G');
            setPlayerTeam(goalieStats[0].team.toString());
          }
        }
      }
    }
  });

  const onSeasonTypeSelect = async (seasonType: SeasonType) => {
    setFilterSeasonType(seasonType);
  };

  return (
    <React.Fragment>
      <NextSeo
        title="Player"
        openGraph={{
          title: 'Player',
        }}
      />
      <Header league={league} activePage="players" isSticky={false} />
      {isLoading && !playerError && (
        <CenteredContent>
          <PulseLoader size={15} />
        </CenteredContent>
      )}
      <Main>
        {playerError && (
          <ErrorBlock>
            Failed to load player info. Please reload the page to try again.
          </ErrorBlock>
        )}
        <SelectorWrapper>
          <SeasonTypeSelector onChange={onSeasonTypeSelect} />
        </SelectorWrapper>
        {!isLoading && (
          <>
            <CenteredContent>
              <PlayerInfo>{playerName} | {playerPosition} | {playerTeam}</PlayerInfo>
            </CenteredContent>
            {!isSkater && (
              <>
                <TableHeading>Stats</TableHeading>
                <TableWrapper>
                  <TableContainer>
                    {goalieStats && (
                      <SingleGoalieScoreTable data={goalieStats} />
                    )}
                  </TableContainer>
                </TableWrapper>
              </>
            )}
            {isSkater && (
              <>
                <TableHeading>Stats</TableHeading>
                <TableWrapper>
                  <TableContainer>
                    {skaterStats && (
                      <SingleSkaterScoreTable data={skaterStats} />
                    )}
                  </TableContainer>
                </TableWrapper>
                <TableHeading>Advanced Stats</TableHeading>
                <TableWrapper>
                  <TableContainer>
                    {skaterStats && (
                      <SingleSkaterAdvStatsTable data={skaterStats} />
                    )}
                  </TableContainer>
                </TableWrapper>
              </>
            )}
            <TableHeading>Ratings</TableHeading>
            <TableWrapper>
              <TableContainer>
                {!isSkater && (
                  <SingleGoalieRatingsTable data={goalieRatings} />
                )}
                {isSkater && (
                  <SinglePlayerRatingsTable data={skaterRatings} />
                )}
              </TableContainer>
            </TableWrapper>
          </>
        )
        }
      </Main >
      <Footer />
    </React.Fragment >
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { league, id } = ctx.query;

    return { props: { league, id } };
  } catch (error) {
    ctx.res.statusCode = 404;

    return { props: { error } };
  }
};

const Main = styled.main`
  height: 100%;
  width: 100%;
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

const SelectorWrapper = styled.div`
  width: 250px;
  float: right;
  margin-right: 3%;
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
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

const PlayerInfo = styled.div`
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
`;

export default PlayerPage;
