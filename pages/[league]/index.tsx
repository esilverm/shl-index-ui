import React from 'react';
import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';
import { GetStaticProps, GetStaticPaths } from 'next';

import Header from '../../components/Header';
import StandingsTable from '../../components/StandingsTable';

interface Props {
  league: string;
}

function LeagueHome({ league }: Props): JSX.Element {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/standings?league=${[
      'shl',
      'smjhl',
      'iihf',
      'wjc',
    ].indexOf(league)}`
  );
  const standings = React.useMemo(() => data, [data]);

  return (
    <React.Fragment>
      <NextSeo
        title={league.toUpperCase()}
        openGraph={{
          title: league.toUpperCase(),
        }}
      />
      <Header league={league} />
      <Container className="content">
        {data && !error && <StandingsTable league={league} data={standings} />}
      </Container>
    </React.Fragment>
  );
}

// LeagueHome.propTypes = {
//   league: PropTypes.string.isRequired,
// };

const Container = styled.div`
  height: 150vh;
  width: 75%;
  padding: 80px 2.5%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.grey100};

  @media screen and (max-width: 768px) {
    width: 95%;
    padding: 2.5%;
  }
`;

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

export default LeagueHome;
