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
import { SearchType } from '../..'

interface Props {
  terms: Array<SearchType>;
  onChange: (term: string) => void;
}

function SearchSelector({ terms, onChange }: Props): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<SearchType>(terms[0]);
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
  const onTermSelect = (event) => {
    const { term } = event.target.dataset;
    const parsedTerm = JSON.parse(term);
    onChange(parsedTerm);
    setSelectedTerm(parsedTerm);
    setIsExpanded(false);
  };

  return (
    <Container ref={selectorRef}>
      <DropdownButton onClick={onButtonClick} inverse>
        <ButtonContent>
          {selectedTerm.term}
          <FarCaret className={isExpanded ? 'up' : 'down'} inverse />
        </ButtonContent>
      </DropdownButton>
      {isExpanded && (
        <DropdownList>
          
          {terms
            .sort((a, b) => (a > b ? 1 : -1))
            .map((term) => {
              const termData: SearchType = {
                id: `${term.id}`,
                term: term.term,
              };
              return (
                <DropdownItem
                  key={term.id}
                  align="left"
                  data-term={JSON.stringify(termData)}
                  onClick={onTermSelect}
                  className={selectedTerm.id === termData.id && 'active'}
                >
                  {term.term}
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
