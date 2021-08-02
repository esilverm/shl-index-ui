import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { Series, SeriesTeam, SeriesScore, Bracket, Round, Container } from './SingleBracket';

function PlayoffsBracketSkeleton({
  isError,
}: {
  isError: boolean;
}): JSX.Element {
  const fakeArray = (length) => new Array(length).fill(0);

  const renderSkeletonSeries = (i) => (
    <Series key={i}>
      <SeriesTeam color={'#CCC'} isDark={false} lost={false}>
        <div style={{ marginLeft: '5px' }}></div>
        <Skeleton width={45} height={45} />
        <span>
          <Skeleton width={100} />
        </span>
        <SeriesScore>
          <Skeleton />
        </SeriesScore>
      </SeriesTeam>
      <SeriesTeam color={'#EEE'} isDark={false} lost={false}>
        <div style={{ marginLeft: '5px' }}></div>
        <Skeleton width={45} height={45} />
        <span>
          <Skeleton width={100} />
        </span>
        <SeriesScore>
          <Skeleton />
        </SeriesScore>
      </SeriesTeam>
    </Series>
  );

  const renderSkeletonBracket = () => (
    <Bracket>
      <Round>
        <Skeleton width={150} height={30} />
        {fakeArray(4).map((_, i) => renderSkeletonSeries(i))}
      </Round>
      <Round>
        <Skeleton width={150} height={30} />
        {fakeArray(2).map((_, i) => renderSkeletonSeries(i))}
      </Round>
      <Round>
        <Skeleton width={150} height={30} />
        <Series>{renderSkeletonSeries(0)}</Series>
      </Round>
    </Bracket>
  );

  return (
    <SkeletonTheme color="#ADB5BD" highlightColor="#CED4DA">
      <Container>
        {isError && (
          <strong>
            A technical error occurred. Please reload the page to try again.
          </strong>
        )}
        {renderSkeletonBracket()}
      </Container>
    </SkeletonTheme>
  );
}

export default React.memo(PlayoffsBracketSkeleton);
