import React from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';

import Header from '../../../../components/Header';
import { Matchup } from '../../../api/v1/schedule/[gameId]';

interface Props {
  league: string;
  gameId: string;
}

function GameResults({ league, gameId }: Props): JSX.Element {
  const { data, error } = useSWR<Matchup>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/schedule/${gameId}`
  );
  console.log(data, error);
  return (
    <React.Fragment>
      <NextSeo
        title='Game'
        openGraph={{
          title: 'Game',
        }}
      />
      <Header league={league} />
      <div>This is a placeholder</div>
    </React.Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { league, gameId } = params;
  return { props: { league, gameId } };
}

export default GameResults;
