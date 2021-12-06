import Link, { LinkProps } from 'next/link';
import React from 'react';

import { getQuerySeason } from '../utils/season';

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
  const seasonParam = querySeason ? `?season=${querySeason}` : '';
  const updatedProps = {
    ...props,
    as: `${as}${seasonParam}`,
  };

  return <Link {...updatedProps}>{children}</Link>;
}

export default React.memo(LinkWithSeason);
