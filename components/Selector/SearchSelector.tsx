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

interface Props {
  searchTypes: Array<string>;
  onChange: (searchType: string) => void;
}

function SearchSelector({ searchTypes, onChange }: Props): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSearchType, setSelectedSearchType] = useState<string>(searchTypes[0]);
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
    const parsedSearchType = event.target.dataset.searchtype;
    onChange(parsedSearchType);
    setSelectedSearchType(parsedSearchType);
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
          {searchTypes
            .sort((a, b) => (a > b ? 1 : -1))
            .map((searchType) => {
              return (
                <DropdownItem
                  key={searchType}
                  align="left"
                  data-searchtype={searchType}
                  onClick={onSearchTypeSelect}
                  className={selectedSearchType === searchType && 'active'}
                >
                  {searchType}
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
