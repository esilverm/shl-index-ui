import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { SeasonType } from '../../pages/api/v1/schedule';

import {
  Container,
  ButtonContent,
  DropdownButton,
  DropdownItem,
  DropdownList,
  Caret,
} from './styles';

interface Props {
  onChange: (type: SeasonType) => void;
}

const SEASON_TYPE: {
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

  const onButtonClick = () => setIsExpanded(!isExpanded);
  const onSeasonTypeSelect = (event) => {
    const { seasontype } = event.target.dataset;
    onChange(seasontype);
    setSelectedSeasonType(seasontype);
    setIsExpanded(false);
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
