import classnames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';

import { getPlayerShortname } from '../../utils/playerHelpers';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';

export const LinePlayer = ({
  player,
  position,
  className,
}: {
  player: { id: number; name: string } | undefined;
  position: string;
  className?: string;
}) => {
  const router = useRouter();
  return (
    <div
      className={classnames(
        'mx-5 flex min-w-[200px] max-w-[350px] flex-col items-center justify-center overflow-hidden whitespace-nowrap rounded py-8 px-12 shadow-[0px_0px_15px_rgba(0,_0,_0,_0.1)]',
        className,
      )}
    >
      <Link
        href={{
          pathname: '/[league]/player/[id]',
          query: {
            ...onlyIncludeSeasonAndTypeInQuery(router.query),
            id: player?.id,
          },
        }}
        className="mb-2.5 inline-block text-ellipsis whitespace-nowrap text-lg font-bold transition-colors hover:text-hyperlink dark:hover:text-hyperlink"
      >
        {getPlayerShortname(player?.name ?? '')}
      </Link>
      <div className="text-base font-semibold">{position}</div>
    </div>
  );
};
