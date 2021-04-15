import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

interface Props {
  data?: Array<{
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

function Leaders({ league, data }: Props): JSX.Element {
  const [isloadingAssets, setLoadingAssets] = useState<boolean>(true);
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
      setLoadingAssets(() => false);
    })();
  }, [data]);

  const topPlayer = data[0];
  const TopPlayerLogo = sprites[topPlayer.team.abbr];
  return (
    <div>
      <LeadersTitle>{data[0].statName} Leaders</LeadersTitle>
      <TopPlayerDataContainer>
        <p>{topPlayer.name}</p>
        <LogoWrapper>
          {
          TopPlayerLogo ? (
            <TopPlayerLogo />
          ) : (
            <Skeleton width={10} height={10} />
          )
          }
        </LogoWrapper>
     
        <p>{topPlayer.stat}</p>
      </TopPlayerDataContainer>
      {
        data.map(({ name, stat, statName }, i) => {
          if (i === 0) return;
          return (
            <PlayerDataContainer key={`${statName}_${name}_${i}`}>          
              <p><span>{i + 1}. </span>{name}</p>
              <p>{stat}</p>
            </PlayerDataContainer>
          )
        })
      }
    </div>
  );
}

const LeadersTitle = styled.h4`
  font-size: 1.3rem;
  margin: 0.5rem 0;
  padding: 0.3rem 0;
  border-bottom: 2px solid ${({theme}) => theme.colors.grey900};
  color: ${({theme}) => theme.colors.grey900};
`;

const TopPlayerDataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Montserrat, sans-serif;
  font-size: 1.5rem;
`;

const PlayerDataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Montserrat, sans-serif;
`;

const LogoWrapper = styled.div`
  width: 1.5rem;
  height: 1.5rem;
`;

export default Leaders;
