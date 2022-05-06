import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { SeasonType } from '../../pages/api/v1/schedule';
import { getQuerySeasonType } from '../../utils/seasonType';

import {
  Container,
  ButtonContent,
  DropdownButton,
  DropdownItem,
  DropdownList,
  Caret,
} from './styles';

interface Props {
  onChange?: (type: SeasonType) => void;
}

export const SEASON_TYPE: {
  [key: string]: SeasonType;
} = {
  PRE: 'Pre-Season',
  REGULAR: 'Regular Season',
  PLAYOFFS: 'Playoffs',
};

function SeasonTypeSelector({ onChange }: Props): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSeasonType, setSelectedSeasonType] = useState<SeasonType>(
    SEASON_TYPE.REGULAR
  );
  const selectorRef = useRef(null);

  const onMouseLeave = useCallback(() => {
    setIsExpanded(false);
    if (selectorRef.current) {
      selectorRef.current.removeEventListener('mouseleave', onMouseLeave);
    }
  }, [selectorRef.current]);

  useEffect(() => {
    if (isExpanded && selectorRef.current) {
      selectorRef.current.addEventListener('mouseleave', onMouseLeave);
    }
  }, [selectorRef, isExpanded]);

  useEffect(() => {
    let nextSeasonType = getQuerySeasonType();

    if (!nextSeasonType) {
      nextSeasonType = SEASON_TYPE.REGULAR;
    }

    setSelectedSeasonType(SEASON_TYPE[nextSeasonType.toUpperCase()]);
  }, []);

  const onButtonClick = () => setIsExpanded(!isExpanded);
  const onSeasonTypeSelect = (event) => {
    const { seasontype } = event.target.dataset;
    const seasonTypeInSearch = window.location.search.match(/([?|&])type=\w+/);
    const queryParamsExist = window.location.search.match(/[?|&]/);

    if (seasontype && seasontype.match(/\w+/)) {
      // set seasontype to key of seasonType in SEASON_TYPE
      const parsedSeasonType = Object.keys(SEASON_TYPE).find(
        (key) => SEASON_TYPE[key] === seasontype
      );

      const updatedSearch = seasonTypeInSearch
        ? window.location.search.replace(
            seasonTypeInSearch[0],
            `${seasonTypeInSearch[1]}type=${parsedSeasonType.toLowerCase()}`
          )
        : queryParamsExist
        ? `${window.location.search}&type=${parsedSeasonType.toLowerCase()}`
        : `?type=${parsedSeasonType.toLowerCase()}`;
      window.history.pushState(null, null, updatedSearch);
      setSelectedSeasonType(seasontype);
      onChange(seasontype as SeasonType);
      setIsExpanded(false);
    }
  };

  return (
    <Container ref={selectorRef}>
      <DropdownButton onClick={onButtonClick} inverse>
        <ButtonContent>
          {selectedSeasonType}
          <FarCaret className={isExpanded ? 'up' : 'down'} inverse />
        </ButtonContent>
      </DropdownButton>
      {isExpanded && (
        <DropdownList>
          {Object.keys(SEASON_TYPE).map((type) => (
            <DropdownItem
              key={SEASON_TYPE[type]}
              align="left"
              data-seasontype={SEASON_TYPE[type]}
              onClick={onSeasonTypeSelect}
              className={SEASON_TYPE[type] === selectedSeasonType && 'active'}
            >
              {SEASON_TYPE[type]}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </Container>
  );
}

const FarCaret = styled(Caret)`
  margin-left: auto;
`;

export default React.memo(SeasonTypeSelector);
