import React from 'react';
import styled from 'styled-components';

function FooterBar(): JSX.Element {
  return (
    <FooterWrapper>
      <FooterText>
        &copy; {new Date().getFullYear()} | Made with 🤍 by the SHL Dev Team |{' '}
        <a
          href="https://simulationhockey.com/index.php"
          rel="noreferrer"
          target="_blank"
        >
          Visit Forum
        </a>
      </FooterText>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  width: 100%;
  height: 64px;
  background-color: ${({ theme }) => theme.colors.grey900};
  color: ${({ theme }) => theme.colors.grey100};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FooterText = styled.div`
  font-family: Montserrat, sans-serif;
  & a:active,
  & a:visited,
  & a:hover,
  & a:link {
    color: ${({ theme }) => theme.colors.grey100};
  }
`;

export default FooterBar;
