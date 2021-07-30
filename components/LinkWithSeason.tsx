import Link, { LinkProps } from 'next/link';
import React from 'react';

import { getQuerySeason } from '../utils/season';

interface SeasonLinkProps extends LinkProps {
  disabled?: boolean;
}

function LinkWithSeason(
  props: React.PropsWithChildren<SeasonLinkProps>
): JSX.Element {
  if (props.disabled) {
    return <div>{props.children}</div>;
  }

  const querySeason = getQuerySeason();
  const seasonParam = querySeason ? `?season=${querySeason}` : '';
  const updatedProps = {
    ...props,
    as: `${props.as}${seasonParam}`,
  };

  return <Link {...updatedProps}>{props.children}</Link>;
}

export default React.memo(LinkWithSeason);
