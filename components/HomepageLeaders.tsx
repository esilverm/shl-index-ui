import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

interface Props {
  leaders?: Array<{
    id: number;
    name: string;
    league: number;
    team: {
      id: number;
      name: string;
      nickname: string;
      abbr: string;
    };
    season: number;
    stat: number | string;
    statName: string;
  }>;
  league: string;
}

function HomepageLeaders({ leaders,  league}: Props): JSX.Element {
  const [sprites, setSprites] = useState<{
    [index: string]: React.ComponentClass<any>;
  }>({});

  useEffect(() => {
    // Dynamically import svg icons based on the league chosen
    (async () => {
      const { default: s } = await import(
        `../public/team_logos/${league.toUpperCase()}/`
      );
      setSprites(() => s);
    })();
  }, [leaders]);


  return (
    <Container>
      <Link href="/[league]/leaders" as={`/${league}/leaders`} passHref><Title>League Leaders</Title></Link>
      {
        leaders[0] ? leaders.map(({name, team, stat, statName}, i) => {
          const Logo = sprites[team.abbr];

          return (
            <LeaderContainer key={`${statName}_${name}_${i}`}>

              <LeaderStatWrapper>
                <LeaderName>{name}</LeaderName>
                <LeaderStats>
                  <span className="stat">{stat}</span>
                  <span className="stat-name">{statName}</span>
                </LeaderStats>
              </LeaderStatWrapper>

              <LogoWrapper>
                {
                  Logo && <Logo />
                }
              </LogoWrapper>
            </LeaderContainer>
          )
        })
        :
        <NoContent>No Data to Display</NoContent>
      }
    </Container>
  );
}


const Container = styled.div`
  width: 100%;
  height: 100%;

  @media screen and (max-width: 1024px) {
    margin-top: 3rem;
  }

  @media screen and (max-width: 800px) {
    margin: 3rem auto;
    width: 80%;
  }
`;

const Title = styled.h3`
  font-size: 2rem;
  padding: 1rem;
  border-bottom: 2px solid ${({theme}) => theme.colors.grey300};
  cursor: pointer;
`;

const NoContent = styled.h3`
  font-size: 1.5rem;
  padding: 1rem;
`;

const LeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid ${({theme}) => theme.colors.grey300};
  margin: 0 5%;
  padding: 1rem 0;
`;

const LeaderStatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LeaderName = styled.h4`
  font-size: 1.3rem;
`;

const LeaderStats = styled.div`
  font-family: Montserrat, sans-serif;
  & span.stat {
    font-size: 3rem;
    font-weight: 800;
    margin-right: 0.2rem;
  }

  & span.stat-name {
    font-size: 1rem;
    text-transform: uppercase;
  }
`;

const LogoWrapper = styled.div`
  width: 30%;
  
`;

export default HomepageLeaders;
