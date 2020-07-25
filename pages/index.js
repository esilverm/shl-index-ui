import React from 'react';
import styled from 'styled-components';

import StyledLink from '../components/StyledLink';

export default function Home() {
  return (
    <>
      <Title>SHL Index</Title>
      <StyledLink href="/[league]" forwardedAs="/shl">
        SHL
      </StyledLink>
    </>
  );
}

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;
