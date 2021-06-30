import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  ButtonContent,
  DropdownButton,
  DropdownItem,
  DropdownList,
  Caret,
} from './styles';

export type LeadersFilter = 'Skaters' | 'Forwards' | 'Defensemen' | 'Goalies';

interface Props {
  activeFilter: LeadersFilter;
  onChange: (type: LeadersFilter) => void;
}

const FILTERS: {
  [key: string]: LeadersFilter;
} = {
  SKATERS: 'Skaters',
  FORWARDS: 'Forwards',
  DEFENSEMEN: 'Defensemen',
  GOALIES: 'Goalies'
};

function LeadersFilterSelector({ activeFilter, onChange }: Props): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLeadersFilter, setSelectedLeadersFilter] = useState(activeFilter);
  const selectorRef = useRef(null);
  const onMouseLeave = () => {
    setIsExpanded(false);
    if (selectorRef.current) {
      selectorRef.current.removeEventListener('mouseleave', onMouseLeave);
    }
  };

  useEffect(() => {
    if (isExpanded && selectorRef.current) {
      selectorRef.current.addEventListener('mouseleave', onMouseLeave);
    }
  }, [selectorRef, isExpanded]);

  useEffect(() => setSelectedLeadersFilter(activeFilter), [activeFilter]);

  const onButtonClick = () => setIsExpanded(!isExpanded);
  const onLeadersFilterSelect = (event) => {
    const { leadersfilter } = event.target.dataset;
    onChange(leadersfilter);
    setSelectedLeadersFilter(leadersfilter);
    setIsExpanded(false);
  };

  return (
    <Container ref={selectorRef}>
      <DropdownButton onClick={onButtonClick} inverse>
        <ButtonContent>
          {selectedLeadersFilter}
          <FarCaret className={isExpanded ? 'up' : 'down'} inverse />
        </ButtonContent>
      </DropdownButton>
      {isExpanded && (
        <DropdownList>
          {Object.keys(FILTERS).map((type) => (
            <DropdownItem
              key={FILTERS[type]}
              align="left"
              data-leadersfilter={FILTERS[type]}
              onClick={onLeadersFilterSelect}
              className={FILTERS[type] === selectedLeadersFilter && 'active'}
            >
              {FILTERS[type]}
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

export default React.memo(LeadersFilterSelector);
