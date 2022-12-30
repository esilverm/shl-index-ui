import { SeasonType } from '../pages/api/v1/schedule';

import { assertUnreachable } from './assertUnreachable';

export const seasonTypeToStatsTableSuffix = (
  type: SeasonType,
): 'ps' | 'rs' | 'po' => {
  switch (type) {
    case 'Pre-Season':
      return 'ps';
    case 'Regular Season':
      return 'rs';
    case 'Playoffs':
      return 'po';
    default:
      return assertUnreachable(type);
  }
};

export const seasonTypeToApiFriendlyParam = (type: SeasonType) =>
  type.toLowerCase().replace('-', '');
