/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';

import Header from '../../components/Header';
import StandingsTable from '../../components/StandingsTable';
import fetcher from '../../lib/fetcher';

interface Props {
  league: string;
}

function Schedule({ league }: Props): JSX.Element {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/standings?league=${[
      'shl',
      'smjhl',
      'iihf',
      'wjc',
    ].indexOf(league)}`,
    fetcher
  );
  const standings = React.useMemo(() => data, [data]);

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
        {data && !error && <StandingsTable league={league} data={standings} />}
      </Container>
    </React.Fragment>
  );
}

const Container = styled.div`
  width: 65%;
  padding: 80px 2.5%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.grey100};

  @media screen and (max-width: 1024px) {
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

export default Schedule;
