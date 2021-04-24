import styled from 'styled-components';

function SearchBar ({
    updateSearchText
  }): JSX.Element {

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
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  padding: 5px 50px 5px 5px;
`;

export const DropdownList = styled.ul`
  position: absolute;
  max-height: 300px;
  width: 100%;
  list-style-type: none;
  background-color: ${({ theme }) => theme.colors.grey100};
  border: 1px solid ${({ theme }) => theme.colors.grey300};
  border-top: none;
  z-index: 1000;
  overflow-y: auto;
`;

interface StyleProps {
    align?: 'left' | 'center' | 'right';
    inverse?: boolean;
  }

export const DropdownButton = styled.button`
width: 100%;
background-color: transparent;
padding: 6px 16px;
border: 1px solid
${(props: StyleProps) => (props.inverse ? 'black' : 'white')};
color: ${(props: StyleProps) => (props.inverse ? 'black' : 'white')};
cursor: pointer;
border-radius: 5px;

&:hover {
background-color: ${({ theme }) => theme.colors.blue600};
}

&:active {
background-color: ${({ theme }) => theme.colors.blue700};
}

@media screen and (max-width: 700px) {
padding: 6px 8px;
}
`;

export const DropdownItem = styled.li`
  line-height: 1.75;
  text-align: ${(props: StyleProps) => (props.align ? props.align : 'center')};
  padding: 2px
    ${(props: StyleProps) => (props.align === 'right' ? '16px' : '0')} 2px
    ${(props: StyleProps) => (props.align === 'left' ? '16px' : '0')};
  cursor: pointer;
  font-family: Montserrat, sans-serif;

  &.active {
    background-color: ${({ theme }) => theme.colors.grey300};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.grey400};
  }
`;
