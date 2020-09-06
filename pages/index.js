import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

export default function Home() {
  return (
    <>
      <NextSeo
        title="Home | SHL Index"
        description="The Simulation Hockey League is a free online forums based sim league where you create your own fantasy hockey player. Join today and create your player, get drafted, sign contracts, become a GM, make trades and compete against 1,800 players from around the world."
        // canonical=""
        openGraph={{
          url: '',
          title: 'Home | SHL Index',
          description:
            'The Simulation Hockey League is a free online forums based sim league where you create your own fantasy hockey player. Join today and create your player, get drafted, sign contracts, become a GM, make trades and compete against 1,800 players from around the world.',
        }}
      />
      <Container>
        <Title>Welcome to the SHL Index</Title>
        <Action>Select a League</Action>
        <LeagueListContainer>
          <Link href="/[league]" as="/shl" passHref>
            <LeagueLink role="link" tabIndex={0}>
              <picture>
                <source
                  srcSet={require('../public/league_logos/SHL.png?webp')}
                  type="image/webp"
                />
                <source
                  srcSet={require('../public/league_logos/SHL.png')}
                  type="image/png"
                />
                <img
                  src={require('../public/league_logos/SHL.png')}
                  alt="SHL Logo"
                  width="80%"
                  height="80%"
                />
              </picture>
            </LeagueLink>
          </Link>
          <Link href="/[league]" as="/smjhl" passHref>
            <LeagueLink role="link" tabIndex={0}>
              <picture>
                <source
                  srcSet={require('../public/league_logos/SMJHL.png?webp')}
                  type="image/webp"
                />
                <source
                  srcSet={require('../public/league_logos/SMJHL.png')}
                  type="image/png"
                />
                <img
                  src={require('../public/league_logos/SMJHL.png')}
                  alt="SMJHL Logo"
                  width="80%"
                  height="80%"
                />
              </picture>
            </LeagueLink>
          </Link>
          <Link href="/[league]" as="/iihf" passHref>
            <LeagueLink role="link" tabIndex={0}>
              <picture>
                <source
                  srcSet={require('../public/league_logos/IIHF.png?webp')}
                  type="image/webp"
                />
                <source
                  srcSet={require('../public/league_logos/IIHF.png')}
                  type="image/png"
                />
                <img
                  src={require('../public/league_logos/IIHF.png')}
                  alt="IIHF Logo"
                  width="80%"
                  height="80%"
                />
              </picture>
            </LeagueLink>
          </Link>
          <Link href="/[league]" as="/wjc" passHref>
            <LeagueLink role="link" tabIndex={0}>
              <picture>
                <source
                  srcSet={require('../public/league_logos/WJC.png?webp')}
                  type="image/webp"
                />
                <source
                  srcSet={require('../public/league_logos/WJC.png')}
                  type="image/png"
                />
                <img
                  src={require('../public/league_logos/WJC.png')}
                  alt="WJC Logo"
                  width="80%"
                  height="80%"
                />
              </picture>
            </LeagueLink>
          </Link>
        </LeagueListContainer>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 80%;
  height: auto;
  margin: 100px auto 0 auto;

  @media screen and (max-width: 414px) {
    width: 90%;
  }
`;

const Title = styled.h2`
  font-family: Raleway, sans-serif;
  font-weight: 800;
  text-align: center;
  margin-bottom: 70px;
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.grey800};
  letter-spacing: 0.1rem;
`;

const Action = styled.h2`
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  text-align: center;
  font-size: 2.4rem;
  color: ${({ theme }) => theme.colors.grey700};
  letter-spacing: 0.1rem;

  @media screen and (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const LeagueListContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
`;

const LeagueLink = styled.div`
  cursor: pointer;
  border-radius: 100%;
  width: 20%;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.3);
  transition: box-shadow 200ms, transform 200ms ease-out;
  padding-top: 20%;
  position: relative;
  min-width: 200px;
  min-height: 200px;
  margin: 4% 2.5%;
  transform: scale(1);
  background-color: ${({ theme }) => theme.colors.grey100};

  &:first-child img {
    width: 75%;
    height: 75%;
    top: 13%;
    left: 14.3%;
  }

  & img {
    width: 80%;
    height: 80%;
    position: absolute;
    top: 10%;
    left: 10%;
    display: block;
    object-fit: contain;
  }

  &:hover {
    box-shadow: 0 15px 25px 4px rgba(0, 0, 0, 0.3);
    transform: scale(1.04);
  }
`;
