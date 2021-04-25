import styled from 'styled-components';

function SearchBar ({
    updateSearchText
  }): JSX.Element {

  // logic to update the search text
  const handleChange = (event) => {
    updateSearchText(event.target.value)
  }

  return (
      <SearchBarWrapper>
          <input id='searchBar' type='text' onChange={handleChange} placeholder='Search'></input>
      </SearchBarWrapper>
  );
}
export default SearchBar

const SearchBarWrapper = styled.div`
  font-size: 20px;
  font-weight: 700;
`;
