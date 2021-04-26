import styled from 'styled-components';
import SearchSelector from '../Selector/SearchSelector'
import { SearchType } from '../..';

interface Props {
  searchTextOnChange: (event) => void;
  searchTypeOnChange: (type: string) => void;
  searchTypes: Array<SearchType>;
}

function SearchBar ({
  searchTextOnChange,
  searchTypeOnChange,
  searchTypes,
  }: Props): JSX.Element {

  return (
      <SearchBarWrapper>
          <input id='searchBar' type='text' onChange={searchTextOnChange} placeholder='Search'></input>
          <SearchSelectorWrapper>
            <SearchSelector searchTypes={searchTypes} onChange={searchTypeOnChange}/>
          </SearchSelectorWrapper>
      </SearchBarWrapper>
  );
}
export default SearchBar

const SearchBarWrapper = styled.div`
  font-size: 20px;
  font-weight: 700;
  display: none;
`;

const SearchSelectorWrapper = styled.div`
  width: 150px;
`;
