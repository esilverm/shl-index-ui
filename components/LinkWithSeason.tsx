import Link, { LinkProps } from 'next/link';
import React from 'react';

import { getQuerySeason } from '../utils/season';

function LinkWithSeason(
  props: React.PropsWithChildren<LinkProps>
): JSX.Element {
  const querySeason = getQuerySeason();
  const seasonParam = querySeason ? `?season=${querySeason}` : '';
  const updatedProps = {
    ...props,
    as: `${props.as}${seasonParam}`,
  };

  return <Link {...updatedProps}>{props.children}</Link>;
}

export default React.memo(LinkWithSeason);
