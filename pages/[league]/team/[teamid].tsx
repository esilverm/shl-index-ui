/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import Error from 'next/error';
import React, { useState } from 'react';
import styled from 'styled-components';
import tinycolor from 'tinycolor2';

// import useSWR from 'swr';
import { PlayerRatings, GoalieRatings, Goalie, Player } from '../../..';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import GoalieRatingsTable from '../../../components/RatingsTable/GoalieRatingsTable';
import SkaterRatingsTable from '../../../components/RatingsTable/SkaterRatingsTable';
import GoalieScoreTable from '../../../components/ScoreTable/GoalieScoreTable';
import SkaterAdvStatsTable from '../../../components/ScoreTable/SkaterAdvStatsTable';
import SkaterScoreTable from '../../../components/ScoreTable/SkaterScoreTable';
import SeasonTypeSelector from '../../../components/Selector/SeasonTypeSelector';
import useGoalieRatings from '../../../hooks/useGoalieRatings';
import useRatings from '../../../hooks/useRatings';
import useTeamRosterStats from '../../../hooks/useTeamRosterStats';
import { SeasonType } from '../../api/v1/teams/[id]/roster/stats';

interface Props {
  leaguename: string;
  id: number;
  season: number;
  conference: number;
  division: number;
  name: string;
  nameDetails: { first: string; second: string };
  abbreviation: string;
  location: string;
  colors: { primary: string; secondary: string; text: string };
  stats: {
    wins: number;
    losses: number;
    overtimeLosses: number;
    shootoutWins: number;
    shootoutLosses: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    winPercent: number;
  };
}

function TeamPage({
  leaguename,
  id,
  name,
  nameDetails,
  abbreviation,
  location,
  colors,
  stats,
}: Props): JSX.Element {
  if (!name) {
    return <Error statusCode={404} />;
  }

  const [, setFilterSeasonType] = useState('Regular Season');
  const { roster, isLoading } = useTeamRosterStats(leaguename, id);
  const [display, setDisplay] = useState('stats');

  const getSkaters = () =>
    roster
      ? (roster.filter((player) => player.position !== 'G') as Array<Player>)
      : [];
  const getGoalies = () =>
    roster
      ? (roster.filter((player) => player.position === 'G') as Array<Goalie>)
      : [];

  // ratings
  const { ratings: skaterratings, isLoading: isLoadingPlayerRatings } =
    useRatings(leaguename);

  const getSkaterRatings = () =>
    skaterratings
      ? (skaterratings.filter(
          (player) => player.position !== 'G' && player.team == abbreviation
        ) as Array<PlayerRatings>)
      : [];

  const { ratings: goalieratingdata, isLoading: isLoadingGoalieRatings } =
    useGoalieRatings(leaguename);

  const getGoalieRating = () =>
    goalieratingdata
      ? (goalieratingdata.filter(
          (player) => player.position === 'G' && player.team == abbreviation
        ) as Array<GoalieRatings>)
      : [];

  const onSeasonTypeSelect = async (seasonType: SeasonType) => {
    setFilterSeasonType(seasonType);
  };

  return (
    <React.Fragment>
      <NextSeo
        title={name}
        additionalMetaTags={[
          { property: 'theme-color', content: colors.primary },
        ]}
        openGraph={{
          title: name,
        }}
      />
      <Header league={leaguename} activePage="teams" team={id} days={10} />
      <TeamHero {...colors}>
        <TeamLogo
          src={require(`../../../public/team_logos/${leaguename.toUpperCase()}/${location
            .replace('.', '')
            .replace(/white|blue/i, '')
            .trim()
            .split(' ')
            .join('_')}.svg`)}
          alt={`${name} logo`}
        />
        <TeamInfoContainer>
          <TeamName bright={tinycolor(colors.primary).isDark()}>
            <span className="first">{nameDetails.first}</span>
            <span className="second">{nameDetails.second}</span>
          </TeamName>
          <TeamHeaderStats bright={tinycolor(colors.primary).isDark()}>
            <span>
              {stats.wins} - {stats.losses} -{' '}
              {stats.overtimeLosses + stats.shootoutLosses}
            </span>{' '}
            | <span>{stats.points} PTS</span> |{' '}
            <span>{stats.winPercent.toFixed(3)}</span>
          </TeamHeaderStats>
        </TeamInfoContainer>
      </TeamHero>
      <Container>
        {/* Data for this page that we can also do: Roster, Historical Stats, etc. */}
        <TableHeading>Skaters</TableHeading>
        <Filters>
          <SeasonTypeSelector onChange={onSeasonTypeSelect} />
        </Filters>
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
            Advanced Stats
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
        <TableWrapper>
          {!isLoading && (
            <TableContainer>
              {display === 'ratings' && !isLoadingPlayerRatings ? (
                <SkaterRatingsTable data={getSkaterRatings()} teamPage />
              ) : display === 'stats' ? (
                <SkaterScoreTable data={getSkaters()} teamPage />
              ) : (
                <SkaterAdvStatsTable data={getSkaters()} teamPage />
              )}
            </TableContainer>
          )}
        </TableWrapper>
        <TableHeading>Goalies</TableHeading>
        <TableWrapper>
          {!isLoading && (
            <TableContainer>
              {display === 'ratings' && !isLoadingGoalieRatings ? (
                <GoalieRatingsTable data={getGoalieRating()} teamPage />
              ) : (
                <GoalieScoreTable data={getGoalies()} teamPage />
              )}
            </TableContainer>
          )}
        </TableWrapper>
      </Container>
      <Footer />
    </React.Fragment>
  );
}

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

const Filters = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 3%;
  justify-content: flex-end;
  float: right;
  margin-top: -88px;

  button {
    width: 200px;
  }

  @media screen and (max-width: 750px) {
    flex-direction: column;
    align-items: center;

    button {
      margin-right: 0;
      margin-bottom: 5px;
      width: 150px;
    }
  }
`;

const TeamHero = styled.div<{
  primary: string;
  secondary: string;
  text: string;
}>`
  width: 100%;
  padding: 0 12.5%;
  min-height: 300px;
  height: 40vh;
  background-color: ${({ primary }) => primary};
  display: flex;
  flex-direction: row;
  align-items: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding: 0;
    padding-top: 5%;
    padding-bottom: 5%;
  }
`;

const TeamLogo = styled.img`
  height: 60%;
  filter: drop-shadow(0 0 1.15rem rgba(0, 0, 0, 0.4));
  margin: 0 5%;
`;

const TeamInfoContainer = styled.div`
  height: 30%;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const TeamName = styled.h1<{ bright: boolean }>`
  color: ${({ bright, theme }) =>
    bright ? theme.colors.grey100 : theme.colors.grey900};
  span {
    display: block;
  }

  span.first {
    font-family: Montserrat, sans-serif;
    font-weight: 400;
    letter-spacing: 0.1rem;
  }

  span.second {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15rem;
  }
`;

const TeamHeaderStats = styled.h3<{ bright: boolean }>`
  color: ${({ bright, theme }) =>
    bright ? theme.colors.grey100 : theme.colors.grey900};
  font-weight: 400;
  font-size: 1.1rem;
  font-family: Montserrat, sans-serif;

  span {
    margin-right: 1rem;
  }

  * + span {
    margin-left: 1rem;
  }

  span:last-child {
    margin-right: 0;
  }
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { league: leaguename, teamid, season } = ctx.query;
    const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(
      typeof leaguename === 'string' ? leaguename : 'shl'
    );

    const teamdata = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_ENDPOINT
      }/api/v1/teams/${teamid}?league=${leagueid}${
        season ? `&season=${season}` : ``
      }`
    ).then((res) => res.json());

    return { props: { leaguename, ...teamdata } };
  } catch (error) {
    ctx.res.statusCode = 404;

    return { props: { error } };
  }
};

export default TeamPage;
