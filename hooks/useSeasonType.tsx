import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import { SeasonType } from '../pages/api/v1/schedule';

export const SEASON_TYPE: {
  [key: string]: SeasonType;
} = {
  PRE: 'Pre-Season',
  REGULAR: 'Regular Season',
  PLAYOFFS: 'Playoffs',
};

const seasonTypeOptions = ['pre', 'regular', 'playoffs'] as const;
export type SeasonTypeOption = typeof seasonTypeOptions[number];

export const useSeasonType = () => {
  const router = useRouter();

  const { type = 'regular' } = router.query;

  const currentType = useMemo(() => {
    const currentSeasonType = type as string;
    if (!currentSeasonType) {
      return SEASON_TYPE.REGULAR;
    }

    return SEASON_TYPE[currentSeasonType.toUpperCase()];
  }, [type]);

  const setSeasonType = useCallback(
    (type: SeasonTypeOption) =>
      router.push(
        {
          query: {
            ...router.query,
            type,
          },
        },
        undefined,
        {
          shallow: true,
        },
      ),
    [router],
  );

  return {
    type: currentType,
    internalType: (type ?? 'regular') as SeasonTypeOption,
    setSeasonType,
  };
};
