import styled from 'styled-components';

export const FlexRow = styled.div<{
  height?: number;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: ${({ height }) => height ? `${height}px` : 'auto'}
`;

export const FlexColumn = styled.div<{
  width?: number;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ width }) => width ? `${width}px` : '100%'};
  height: fit-content;
`;

export const SectionTitle = styled.span`
  font-weight: 600;
`;

export const TeamLogoSmall = styled.div`
  width: 25px;
  height: 25px;
`;

export const ComparisonHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
  padding-bottom: 15px;
`;
