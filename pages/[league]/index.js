import React from 'react';
import { useRouter } from 'next/router';

function LeagueHome() {
  const router = useRouter();

  const { league } = router.query;

  return (
    <>
      <div id="container">
        <h1>
          <em>{league}</em>
        </h1>
      </div>
    </>
  );
}

export default LeagueHome;
