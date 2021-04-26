import styled from 'styled-components';
import SearchSelector from '../Selector/SearchSelector';
import { SearchType } from '../..';

interface Props {
  searchTextOnChange: (event) => void;
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
export default SearchBar;

const SearchBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 1rem 0;
`;

const SearchBarInput = styled.input`
  font-family: Raleway, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  margin-left: 1rem;
  padding: 0 8px;
`;


const SearchSelectorWrapper = styled.div`
  width: 150px;
`;
