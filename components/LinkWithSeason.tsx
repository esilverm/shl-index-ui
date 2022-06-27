import Link, { LinkProps } from 'next/link';
import React from 'react';

import { getQuerySeason } from '../utils/season';
import { getQuerySeasonType } from '../utils/seasonType';

interface SeasonLinkProps extends LinkProps {
  disabled?: boolean;
}

function LinkWithSeason({
  as,
  children,
  disabled,
  ...props
}: React.PropsWithChildren<SeasonLinkProps>): JSX.Element {
  if (disabled) {
    return <div>{children}</div>;
  }

  const querySeason = getQuerySeason();
  const querySeasonType = getQuerySeasonType();
  const seasonParam = querySeason ? `?season=${querySeason}` : '';
  const seasonTypeParam =
    seasonParam && querySeasonType
      ? `&type=${querySeasonType}`
      : querySeasonType
      ? `?type=${querySeasonType}`
      : '';
  const updatedProps = {
    ...props,
    as: `${as}${seasonParam}${seasonTypeParam}`,
  };

  return <Link {...updatedProps}>{children}</Link>;
}

export default React.memo(LinkWithSeason);
