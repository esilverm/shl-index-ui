import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import styled from 'styled-components';

import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import SingleGoalieRatingsTable from '../../../components/RatingsTable/SingleGoalieRatingsTable';
import SinglePlayerRatingsTable from '../../../components/RatingsTable/SingleSkaterRatingsTable';
import SingleGoalieScoreTable from '../../../components/ScoreTable/SingleGoalieScoreTable';
import SingleSkaterAdvStatsTable from '../../../components/ScoreTable/SingleSkaterAdvStatsTable';
import SingleSkaterScoreTable from '../../../components/ScoreTable/SingleSkaterScoreTable';
import SeasonTypeSelector from '../../../components/Selector/SeasonTypeSelector';
import useGoalieInfo from '../../../hooks/useGoalieInfo';
import useGoalieRatingsId from '../../../hooks/useGoalieRatingsId';
import useGoalieStatsId from '../../../hooks/useGoalieStatsId';
import useRatingsId from '../../../hooks/useRatingsId';
import useSkaterInfo from '../../../hooks/useSkaterInfo';
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

  const router = useRouter();

  // player info
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [playerTeam, setPlayerTeam] = useState('');
  const [playerWeight, setPlayerWeight] = useState('');
  const [playerHeight, setPlayerHeight] = useState('');

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

  // player info
  const {
    ratings: goalieInfo,
    isLoading: isLoadingGoalieInfo,
    isError: isErrorGoalieInfo,
  } = useGoalieInfo(id, league)

  const {
    ratings: skaterInfo,
    isLoading: isLoadingSkaterInfo,
    isError: isErrorSkaterInfo,
  } = useSkaterInfo(id, league)

  // wait for all loads to complete
  useEffect(() => {
    setIsLoading(isLoadingGoalieRating || isLoadingPlayerRating || isLoadingGoalieStats
      || isLoadingSkaterStats || isLoadingGoalieInfo || isLoadingSkaterInfo);
    if (!isLoading) {
      if (isErrorGoalieRating || isErrorPlayerRating || isErrorGoalieStats
        || isErrorSkaterStats || isErrorSkaterInfo || isErrorGoalieInfo) {
        setPlayerError(true);
      } else {
        if (skaterStats !== undefined && skaterInfo !== undefined) {
          if (skaterStats.length > 0) {
            setIsSkater(true);
            setPlayerName(skaterStats[0].name);
            setPlayerPosition(skaterStats[0].position);
            setPlayerTeam(skaterStats[0].team.toString());
            setPlayerHeight(skaterInfo[0].height.toString());
            setPlayerWeight(skaterInfo[0].weight.toString());
          } else {
            setIsSkater(false);
            setPlayerName(goalieStats[0].name);
            setPlayerPosition('G');
            setPlayerTeam(goalieStats[0].team.toString());
            setPlayerHeight(goalieInfo[0].height.toString());
            setPlayerWeight(goalieInfo[0].weight.toString());
          }
        }
      }
    }
  }, [skaterStats, skaterInfo, goalieStats, goalieInfo]);

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
      <Container>
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
          <ControlWrapper>
            <Button onClick={() => router.back()} inverse>
              <ButtonContent>
                Go Back
              </ButtonContent>
            </Button>
            <SelectorWrapper>
              <SeasonTypeSelector onChange={onSeasonTypeSelect} />
            </SelectorWrapper>
          </ControlWrapper>
          {!isLoading && (
            <>
              <CenteredContent>
                <PlayerInfo>{playerName} | {playerPosition} | {playerHeight} in | {playerWeight} lbs | {playerTeam}</PlayerInfo>
              </CenteredContent>
              {isSkater === true ? (
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
              ) : (
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
              <TableHeading>Ratings</TableHeading>
              <TableWrapper>
                <TableContainer>
                  {isSkater === true ? (
                    <SinglePlayerRatingsTable data={skaterRatings} />
                  ) : (
                    <SingleGoalieRatingsTable data={goalieRatings} />
                  )}
                </TableContainer>
              </TableWrapper>
            </>
          )}
        </Main >
      </Container>
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
  font-size: 1.1rem;
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
`;

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

const ButtonContent = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-weight: 700;
`;

const Button = styled.button`
  width: 125px;
  background-color: transparent;
  padding: 6px 16px;
  border: 1px solid
    ${(props: StyleProps) => (props.inverse ? 'black' : 'white')};
  color: ${(props: StyleProps) => (props.inverse ? 'black' : 'white')};
  cursor: pointer;
  border-radius: 5px;
  float:left;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blue600};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.blue700};
  }

  @media screen and (max-width: 700px) {
    padding: 6px 8px;
  }
`;

const ControlWrapper = styled.div`
  margin: 3%;
  height: 25px;
`;

interface StyleProps {
  align?: 'left' | 'center' | 'right';
  inverse?: boolean;
}

export default PlayerPage;
