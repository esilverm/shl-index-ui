import { useMemo } from 'react';

import { SeasonTypeOption, useSeasonType } from '../hooks/useSeasonType';
import { SeasonType } from '../pages/api/v1/schedule';

import { Select } from './common/Select';

export const SeasonTypeSelector = ({ className }: { className?: string }) => {
  const { internalType, setSeasonType } = useSeasonType();

  const optionsMap = useMemo(
    () =>
      new Map<SeasonTypeOption, SeasonType>([
        ['pre', 'Pre-Season'],
        ['regular', 'Regular Season'],
        ['playoffs', 'Playoffs'],
      ]),
    [],
  );

  return (
    <Select<SeasonTypeOption>
      options={['pre', 'regular', 'playoffs']}
      selectedOption={internalType}
      onSelection={setSeasonType}
      optionsMap={optionsMap}
      className={className}
    />
  );
};
