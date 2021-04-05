import React from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';

import Header from '../../../../components/Header';

interface Props {
  league: number;
  gameId: string;
}

function GameResults({ league, gameId }: Props): JSX.Element {
  console.log(league, gameId);
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
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];
  const leagueId = leagues.indexOf(league as string);

  return { props: { league: leagueId, gameId } };
}

export default GameResults;
