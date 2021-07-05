import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { SearchType } from '../..';

import {
  Container,
  ButtonContent,
  DropdownButton,
  DropdownItem,
  DropdownList,
  Caret,
} from './styles';

interface Props {
  searchTypes: Array<SearchType>;
  onChange: (searchType: string) => void;
}

function SearchSelector({ searchTypes, onChange }: Props): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSearchType, setSelectedSearchType] = useState<string>(
    searchTypes[0].text
  );
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

  const onButtonClick = () => setIsExpanded(!isExpanded);
  const onSearchTypeSelect = (event) => {
    const searchType = event.target.dataset.searchtype;
    const parsedSearchType = JSON.parse(searchType);
    onChange(parsedSearchType.id);
    setSelectedSearchType(parsedSearchType.text);
    setIsExpanded(false);
  };

  return (
    <Container ref={selectorRef}>
      <DropdownButton onClick={onButtonClick} inverse>
        <ButtonContent>
          {selectedSearchType}
          <FarCaret className={isExpanded ? 'up' : 'down'} inverse />
        </ButtonContent>
      </DropdownButton>
      {isExpanded && (
        <DropdownList>
          {searchTypes.map((searchType) => {
            return (
              <DropdownItem
                key={searchType.text}
                align="left"
                data-searchtype={JSON.stringify(searchType)}
                onClick={onSearchTypeSelect}
                className={selectedSearchType === searchType.text && 'active'}
              >
                {searchType.text}
              </DropdownItem>
            );
          })}
        </DropdownList>
      )}
    </Container>
  );
}

const FarCaret = styled(Caret)`
  margin-left: auto;
`;

export default React.memo(SearchSelector);
