import styled from 'styled-components';

interface StyleProps {
  align?: "left" | "center" | "right";
  inverse?: boolean;
}

export const Container = styled.div`
  position: relative;
`;

export const ButtonContent = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-weight: 700;
`;

export const DropdownButton = styled.button`
  width: 100%;
  background-color: transparent;
  padding: 6px 16px;
  border: 1px solid ${(props: StyleProps) => props.inverse ? 'black' : 'white'};
  color: ${(props: StyleProps) => props.inverse ? 'black' : 'white'};
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

export const SeasonText = styled.span`
  &::after {
    content: 'Season';
    margin-right: 4px;
  }

  @media screen and (max-width: 700px) {
    &::after {
      content: 'S';
      margin-right: 0;
    }
  }
`;

export const Caret = styled.span`
  width: 0;
  height: 0;
  display: inline-block;
  border: 5px solid transparent;
  margin-left: 5px;

  &.down {
    border-top-color: ${(props: StyleProps) => props.inverse ? 'black' : 'white'};
    margin-top: 5px;
  }

  &.up {
    border-bottom-color: ${(props: StyleProps) => props.inverse ? 'black' : 'white'};
    margin-bottom: 5px;
  }
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

export const DropdownItem = styled.li`
  line-height: 1.75;
  text-align: ${(props: StyleProps) => props.align ? props.align : 'center'};
  padding: 2px ${(props: StyleProps) => props.align === 'right' ? '16px' : '0'} 2px ${(props: StyleProps) => props.align === 'left' ? '16px' : '0'};
  cursor: pointer;

  &.active {
    background-color: ${({ theme }) => theme.colors.grey300};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.grey400};
  }
`;