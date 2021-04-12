import React from 'react';
import styled from 'styled-components';

function FooterBar(): JSX.Element {
  return (
    <FooterWrapper>
      <FooterText>
        &copy; {new Date().getFullYear()} |{' '}
        <span>Made with ♥︎ by the SHL Dev Team | </span>
        <a
          href="https://simulationhockey.com/index.php"
          rel="noreferrer"
          target="_blank"
        >
          Visit Forum
        </a>{' '}
        |{' '}
        <a
          href="https://gitreports.com/issue/esilverm/shl-index-ui/"
          rel="noreferrer"
          target="_blank"
        >
          Report a Bug
        </a>{' '}
        | <a href="/api">API Docs</a>
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
  font-size: 0.8rem;
  & a:active,
  & a:visited,
  & a:hover,
  & a:link {
    color: ${({ theme }) => theme.colors.grey100};
  }

  @media screen and (max-width: 510px) {
    & span {
      display: none;
    }
  }
`;

export default FooterBar;
