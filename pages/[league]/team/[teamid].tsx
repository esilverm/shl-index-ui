/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
// import useSWR from 'swr';
import Header from '../../../components/Header';
import fetcher from '../../../lib/fetcher';
import Error from 'next/error';

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
}

function TeamPage({
  leaguename,
  id,
  name,
  nameDetails,
  location,
  colors,
}: Props): JSX.Element {
  if (!name) {
    return <Error statusCode={404} />;
  }

  return (
    <React.Fragment>
      <Header league={leaguename} activePage="teams" team={id} days={10} />
      <TeamHero {...colors}>
        <TeamLogo
          src={require(`../../../public/team_logos/${leaguename.toUpperCase()}/${location
            .replace('.', '')
            .split(' ')
            .join('_')}.svg?inline`)}
          alt={`${name} logo`}
        />
        <TeamInfoContainer>
          <TeamName
            color={
              ['Kelowna', 'Maine', 'Anaheim'].indexOf(location) != -1
                ? '#FFFFFF'
                : colors.text
            }
          >
            <span className="first">{nameDetails.first}</span>
            <span className="second">{nameDetails.second}</span>
          </TeamName>
        </TeamInfoContainer>
      </TeamHero>
    </React.Fragment>
  );
}

const TeamHero = styled.div<{
  primary: string;
  secondary: string;
  text: string;
}>`
  width: 100%;
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
  border: 1px solid white;
  height: 40%;
  width: 50%; // auto;
`;

const TeamName = styled.h1<{ color: string }>`
  // color: ${({ theme }) => theme.colors.grey100};
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { league: leaguename, teamid, season } = ctx.query;
    const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(
      typeof leaguename === 'string' ? leaguename : 'shl'
    );

    const teamdata = await fetcher(
      `http://localhost:3000/api/v1/teams/${teamid}?league=${leagueid}${
        season ? `&season=${season}` : ``
      }`
    );

    return { props: { leaguename, ...teamdata } };
  } catch (error) {
    ctx.res.statusCode = 404;
    console.log(error);
    return { props: { error } };
  }
};

export default TeamPage;
