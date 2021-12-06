import React from 'react';
import styled from 'styled-components';

import { SearchType } from '../..';
import SearchSelector from '../Selector/SearchSelector';

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
      <Table>
        <TableRow>
          <TableData>
            <SearchSelectorWrapper>
              <SearchSelector
                searchTypes={searchTypes}
                onChange={searchTypeOnChange}
              />
            </SearchSelectorWrapper>
          </TableData>
          <TableData>
            <SearchBarInput
              type="text"
              onChange={searchTextOnChange}
              placeholder="Search"
            />
          </TableData>
        </TableRow>
      </Table>
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

const Table = styled.table``;

const TableRow = styled.tr``;

const TableData = styled.td`
  padding: 2px;
`;

const SearchBarInput = styled.input`
  font-family: Montserrat, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  margin-left: 1rem;
  height: 30px;
  padding: 0 8px;
  border-radius: 5px;
  border: 1px solid black;
  color: black;
`;

const SearchSelectorWrapper = styled.div`
  width: 30%;
  max-width: 150px;
  min-width: 100px;

  @media screen and (max-width: 400px) {
    flex-grow: 1;
  }
`;

export default SearchBar;
