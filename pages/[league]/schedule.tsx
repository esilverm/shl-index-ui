/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import styled from 'styled-components';
import Header from '../../components/Header';
import GameDaySchedule from '../../components/GameDaySchedule';
import { Team } from '../..';
import useSchedule from '../../hooks/useSchedule';
import { getQuerySeason } from '../../utils/season';

interface Props {
  league: string;
  teamlist: Array<Team>;
}

function Schedule({ league, teamlist }: Props): JSX.Element {
  const [seasonType, setSeasonType] = useState('Regular Season');
  const { games, isLoading } = useSchedule(league, seasonType);
  const [isScheduleRendered, setIsScheduleRendered] = useState(false);
  const [showAllDates, setShowAllDates] = useState(false);
  const [filterTeam, setFilterTeam] = useState<number>();
  const [isLoadingAssets, setLoadingAssets] = useState<boolean>(true);
  const [sprites, setSprites] = useState<{
    [index: string]: React.ComponentClass<any>;
  }>({});
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
      setIsScheduleRendered(containerElem.clientHeight > 0);
    }
  });

  const sortGamesByDate = () => {
    const unsortedGames = [...games];
    return unsortedGames.sort(
      (gameA, gameB) =>
        new Date(gameA.date).valueOf() - new Date(gameB.date).valueOf()
    );
  };

  const hasFilteredTeam = game => filterTeam === undefined || (game.awayTeam === filterTeam || game.homeTeam === filterTeam);

  const getDatesForRendering = (sortedGames) => {
    const gameDates = [];
    sortedGames.some(game => {
      if (!gameDates.includes(game.date) && hasFilteredTeam(game)) {
        gameDates.push(game.date);
      }

      return !showAllDates && gameDates.length >= 32;
    });

    return gameDates;
  };

  const renderGameDays = () => {
    if (isLoading || isLoadingAssets) return null;

    const gameDaySchedules = [];
    const sortedGames = sortGamesByDate();
    const gameDates = getDatesForRendering(sortedGames);

    gameDates.forEach((date) => {
      const gamesOnDate = sortedGames.filter(game => game.date === date);
      const filteredGamesOnDate = gamesOnDate.filter(game => hasFilteredTeam(game));

      gameDaySchedules.push(
        <GameDaySchedule
          key={date}
          date={date}
          games={filteredGamesOnDate}
          teamlist={teamlist}
          sprites={sprites}
        />
      );
    });

    return gameDaySchedules;
  };

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
        <SeasonTypeSelectContainer role="tablist">
          <SeasonTypeSelectItem
            key="Pre-Season"
            onClick={() => setSeasonType(() => 'Pre-Season')}
            active={seasonType === 'Pre-Season'}
            tabIndex={0}
            role="tab"
            aria-selected={seasonType === 'Pre-Season'}
          >
            Pre-Season
          </SeasonTypeSelectItem>
          <SeasonTypeSelectItem
            key="Regular Season"
            onClick={() => setSeasonType(() => 'Regular Season')}
            active={seasonType === 'Regular Season'}
            tabIndex={0}
            role="tab"
            aria-selected={seasonType === 'Regular Season'}
          >
            Regular Season
          </SeasonTypeSelectItem>
          <SeasonTypeSelectItem
            key="Playoffs"
            onClick={() => setSeasonType(() => 'Playoffs')}
            active={seasonType === 'Playoffs'}
            tabIndex={0}
            role="tab"
            aria-selected={seasonType === 'Playoffs'}
          >
            Playoffs
          </SeasonTypeSelectItem>
        </SeasonTypeSelectContainer>
        <Filters>
          Team
          <select onChange={(value) => setFilterTeam(parseInt(value.target.value) || undefined)} value={filterTeam || "all"}>
            <option value="all">All</option>
            <option value="5">NEW</option>
            <option value="0">BUF</option>
            <option value="10">MIN</option>
          </select>
        </Filters>
        <ScheduleContainer ref={scheduleContainerRef}>{renderGameDays()}</ScheduleContainer>
        {isScheduleRendered && !showAllDates && <button onClick={() => setShowAllDates(true)}>Load all games</button>}
      </Container>
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

const SeasonTypeSelectContainer = styled.div`
  margin: 0 auto 40px;
  width: 95%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
`;

const SeasonTypeSelectItem = styled.div<{ active: boolean }>`
  display: inline-block;
  padding: 8px 20px;
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

`;

const ScheduleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 95%;
  margin: 0 auto 40px;
  flex-wrap: wrap;
`;

export const getStaticPaths: GetStaticPaths = async () => {
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];

  const paths = leagues.map((league) => ({
    params: { league },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { league: leaguename } = ctx.params;
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(
    typeof leaguename === 'string' ? leaguename : 'shl'
  );
  const season = getQuerySeason();
  const seasonParam = season ? `&season=${season}` : '';

  const teamlist = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/teams?league=${leagueid}${seasonParam}`
  ).then((res) => res.json());

  return { props: { league: ctx.params.league, teamlist } };
};

export default Schedule;
