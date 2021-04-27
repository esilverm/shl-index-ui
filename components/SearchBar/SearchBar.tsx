import React from 'react';
import styled from 'styled-components';
import SearchSelector from '../Selector/SearchSelector';
import { SearchType } from '../..';

interface Props {
  searchTextOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchTypeOnChange: (type: string) => void;
  searchTypes: Array<SearchType>;
}

function SearchBar({
  searchTextOnChange,
  searchTypeOnChange,
  searchTypes,
}: Props): JSX.Element {
  return (
    <SearchBarWrapper>
      <SearchSelectorWrapper>
        <SearchSelector
          searchTypes={searchTypes}
          onChange={searchTypeOnChange}
        />
      </SearchSelectorWrapper>
      <SearchBarInput
        type="text"
        onChange={searchTextOnChange}
        placeholder="Search"
      />
    </SearchBarWrapper>
  );
}

const SearchBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 1rem 0;

  @media screen and (max-width: 400px) {
    justify-content: center;
  }
`;

const SearchBarInput = styled.input`
  font-family: Montserrat, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  margin-left: 1rem;
  padding: 0 8px;
  border-radius: 5px;
  border: 1px solid black;
  color: black;
`;

const SearchSelectorWrapper = styled.div`
  width: 20%;
  max-width: 150px;

  @media screen and (max-width: 400px) {
    flex-grow: 1;
  }
`;

export default SearchBar;
