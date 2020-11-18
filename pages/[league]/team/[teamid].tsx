/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { GetServerSideProps } from 'next';
import Error from 'next/error';
import styled from 'styled-components';
import { NextSeo } from 'next-seo';

// import useSWR from 'swr';
import Header from '../../../components/Header';
import useTeamRosterStats from '../../../hooks/useTeamRosterStats';
import SkaterScoreTable from '../../../components/ScoreTable/SkaterScoreTable';
import GoalieScoreTable from '../../../components/ScoreTable/GoalieScoreTable';
import { Goalie, Player } from '../../..';

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
  location,
  colors,
  stats,
}: Props): JSX.Element {
  if (!name) {
    return <Error statusCode={404} />;
  }

  const { roster, isLoading } = useTeamRosterStats(leaguename, id);

  if (!isLoading) console.log(roster);

  const getSkaters = () => roster ? roster.filter((player) => player.position !== 'G') as Array<Player> : [];
  const getGoalies = () => roster ? roster.filter((player) => player.position === 'G') as Array<Goalie> : [];

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
            .split(' ')
            .join('_')}.svg`)}
          alt={`${name} logo`}
        />
        <TeamInfoContainer>
          <TeamName
            color={
              ['Anchorage', 'Kelowna', 'Maine', 'Anaheim'].indexOf(location) != -1
                ? '#FFFFFF'
                : colors.text
            }
          >
            <span className="first">{nameDetails.first}</span>
            <span className="second">{nameDetails.second}</span>
          </TeamName>
          <TeamHeaderStats
            color={
              ['Anchorage', 'Kelowna', 'Maine', 'Anaheim'].indexOf(location) !=
              -1
                ? '#FFFFFF'
                : colors.text
            }
          >
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
        <div>Team Skater Stats</div>
        <TableWrapper>
          {
            !isLoading && <TableContainer><SkaterScoreTable data={getSkaters()} /></TableContainer>
          }
        </TableWrapper>
        <div>Team Goalie Stats</div>
        <TableWrapper>
          {
            !isLoading && <TableContainer><GoalieScoreTable data={getGoalies()} /></TableContainer>
          }
        </TableWrapper>
      </Container>
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
    width: 95%;
    padding: 2.5%;
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

const TeamName = styled.h1<{ color: string }>`
  color: ${({ color }) => color};
  span {
    display: block;
  }

  span.first {
    font-weight: 300;
    letter-spacing: 0.1rem;
  }

  span.second {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15rem;
  }
`;

const TeamHeaderStats = styled.h3<{ color: string }>`
  color: ${({ color }) => color};
  font-weight: 100;
  font-size: 1.1rem;

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

const TableWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

const TableContainer = styled.div`
  width: 100%;
  margin: 30px 0;
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
