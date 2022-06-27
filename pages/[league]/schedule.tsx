/* eslint-disable no-unused-vars */
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import React, { useEffect, useRef, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import styled from 'styled-components';

import { Team } from '../..';
import Footer from '../../components/Footer';
import GameDaySchedule from '../../components/GameDaySchedule';
import Header from '../../components/Header';
import SeasonTypeSelector from '../../components/Selector/SeasonTypeSelector';
import TeamSelector, {
  MinimalTeam,
} from '../../components/Selector/TeamSelector';
import useSchedule from '../../hooks/useSchedule';
import { SeasonType } from '../api/v1/schedule';

enum SCHEDULE_STATES {
  INITIAL_LOADING = 'INITIAL_LOADING',
  INITIAL_LOADED = 'INITIAL_LOADED',
  FULL_LOADING = 'FULL_LOADING',
  FULL_LOADED = 'FULL_LOADED',
}
type ScheduleState = keyof typeof SCHEDULE_STATES;

const initialNumberOfGames = 32;

interface Props {
  league: string;
  teamlist: Array<Team>;
}

function Schedule({ league, teamlist }: Props): JSX.Element {
  const [scheduleHeight, setScheduleHeight] = useState(0);
  const [scheduleState, setScheduleState] =
    useState<ScheduleState>('INITIAL_LOADING');
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [filterSeasonType, setFilterSeasonType] = useState('Regular Season');
  const [filterTeam, setFilterTeam] = useState<number>(-1);
  const [isLoadingAssets, setLoadingAssets] = useState<boolean>(true);
  const [sprites, setSprites] = useState<{
    [index: string]: React.ComponentClass<any>;
  }>({});
  const { games, isLoading } = useSchedule(league);
  const scheduleContainerRef = useRef();

  useEffect(() => {
    // Dynamically import svg icons based on the league chosen
    (async () => {
      const { default: s } = await import(
        `../../public/team_logos/${league.toUpperCase()}/`
      );

      setSprites(() => s);
      setLoadingAssets(() => false);
    })();
  }, []);

  useEffect(() => {
    if (scheduleContainerRef.current) {
      const containerElem = scheduleContainerRef.current as HTMLElement;
      if (containerElem.clientHeight > scheduleHeight) {
        const newState =
          scheduleState === SCHEDULE_STATES.INITIAL_LOADING
            ? SCHEDULE_STATES.INITIAL_LOADED
            : SCHEDULE_STATES.FULL_LOADED;

        setScheduleState(newState);
        setScheduleHeight(containerElem.clientHeight);
      }
    }
  });

  useEffect(() => {
    const isInitialLoading = scheduleState === SCHEDULE_STATES.INITIAL_LOADING;
    const isFullLoading = scheduleState === SCHEDULE_STATES.FULL_LOADING;

    if (isInitialLoading || isFullLoading) {
      setShowFullSchedule(isFullLoading);
    }
  }, [scheduleState]);

  useEffect(() => {
    setScheduleState(SCHEDULE_STATES.INITIAL_LOADING);
    setScheduleHeight(0);
  }, [filterSeasonType, filterTeam]);

  const onSeasonTypeSelect = async (seasonType: SeasonType) => {
    setScheduleState(SCHEDULE_STATES.INITIAL_LOADING);
    setFilterSeasonType(seasonType);
  };

  const onTeamSelect = (team: MinimalTeam) => setFilterTeam(parseInt(team.id));

  const onLoadAllGames = () => setScheduleState(SCHEDULE_STATES.FULL_LOADING);

  const hasFilteredTeam = (game) =>
    filterTeam === -1 ||
    game.awayTeam === filterTeam ||
    game.homeTeam === filterTeam;

  const getDatesForRendering = (sortedGames) => {
    let gameDates = sortedGames.reduce((acc, game) => {
      if (!acc.includes(game.date) && hasFilteredTeam(game)) {
        return [...acc, game.date];
      }
      return acc;
    }, []);

    if (gameDates.length <= initialNumberOfGames && !showFullSchedule) {
      setShowFullSchedule(true);
    } else if (!showFullSchedule) {
      gameDates = gameDates.slice(0, initialNumberOfGames);
    }

    return gameDates;
  };

  const renderGameDays = () => {
    if (isLoading || isLoadingAssets) return null;

    // Parse our dates first since mobile browsers can't do so
    const sortedGames = [...games].sort((gameA, gameB) => {
      const [aYear, aMonth, aDate] = gameA.date
        .split('-')
        .map((v) => parseInt(v));
      const [bYear, bMonth, bDate] = gameB.date
        .split('-')
        .map((v) => parseInt(v));
      return (
        new Date(aYear, aMonth - 1, aDate).valueOf() -
        new Date(bYear, bMonth - 1, bDate).valueOf()
      );
    });
    const gameDates = getDatesForRendering(sortedGames);

    const gameDaySchedules = gameDates.reduce((acc, date) => {
      const gamesOnDate = sortedGames.filter((game) => game.date === date);
      const filteredGamesOnDate = gamesOnDate.filter((game) =>
        hasFilteredTeam(game)
      );

      return [
        ...acc,
        <GameDaySchedule
          key={date}
          date={date}
          games={filteredGamesOnDate}
          teamlist={teamlist}
          sprites={sprites}
        />,
      ];
    }, []);

    return gameDaySchedules.length > 0 ? gameDaySchedules : 'No games found';
  };

  const isScheduleLoading =
    scheduleState === SCHEDULE_STATES.INITIAL_LOADING ||
    scheduleState === SCHEDULE_STATES.FULL_LOADING;

  return (
    <React.Fragment>
      <NextSeo
        title="Schedule"
        openGraph={{
          title: 'Schedule',
        }}
      />
      <Header league={league} activePage="schedule" />
      <Container>
        <Filters>
          <SeasonTypeSelector onChange={onSeasonTypeSelect} />
          <TeamSelector teams={teamlist} onChange={onTeamSelect} />
        </Filters>
        <ScheduleContainer ref={scheduleContainerRef}>
          {renderGameDays()}
        </ScheduleContainer>
        <LoadingWrapper isLoading={isScheduleLoading}>
          {isScheduleLoading && <PulseLoader size={15} />}
          {!isScheduleLoading && !showFullSchedule && (
            <LoadAllButton onClick={onLoadAllGames}>
              Load all games
            </LoadAllButton>
          )}
        </LoadingWrapper>
      </Container>
      <Footer />
    </React.Fragment>
  );
}

const Container = styled.div`
  width: 75%;
  padding: 41px 0 40px 0;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.grey100};

  @media screen and (max-width: 1024px) {
    width: 100%;
    padding: 2.5%;
  }
`;

const Filters = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 4%;
  justify-content: flex-end;

  button {
    width: 225px;
    margin-right: 10px;
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

const ScheduleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 95%;
  margin: 0 auto 40px;
  flex-wrap: wrap;
`;

const LoadingWrapper = styled.div<{ isLoading: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ isLoading }) => (isLoading ? 'height: 65vh' : '')};
`;

const LoadAllButton = styled.button`
  display: inline-block;
  padding: 8px 20px;
  border: 1px solid ${({ theme }) => theme.colors.grey500};
  background-color: ${({ theme }) => theme.colors.grey100};
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grey300};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.grey200};
  }
`;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { season, league: leaguename },
  } = ctx;

  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(
    typeof leaguename === 'string' ? leaguename : 'shl'
  );

  const seasonParam = season ? `&season=${season}` : '';

  const teamlist = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/teams?league=${leagueid}${seasonParam}`
  ).then((res) => res.json());

  return { props: { league: leaguename, teamlist } };
};

export default Schedule;
