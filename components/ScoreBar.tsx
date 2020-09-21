import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { PulseLoader } from 'react-spinners';

import ScoreBarItem from './ScoreBarItem';

// Determine prop types when actually implementing in conjunction with backend
interface Props {
  data: Array<{
    type: string;
    season: string;
    gameid: string;
    homeScore?: number;
    awayScore?: number;
    ot?: number;
    shootout?: number;
  }>;
  league: string;
}

function ScoreBar({ data, league }: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [sprites, setSprites] = useState<{
    [index: string]: React.ComponentClass<any>;
  }>({});

  const teams = [
    'Buffalo',
    'Chicago',
    'Hamilton',
    'Toronto',
    'Manhattan',
    'NewEngland',
    'TampaBay',
    'Baltimore',
    'Calgary',
    'Edmonton',
    'Minnesota',
    'Winnipeg',
    'SanFrancisco',
    'LosAngeles',
    'NewOrleans',
    'Texas',
  ];

  useEffect(() => {
    // Dynamically import svg icons based on the league chosen
    (async () => {
      const { default: s } = await import(`../public/team_logos/${'SHL'}/`); // league.toUpperCase();
      setSprites(() => s);
      setLoading(() => false);
    })();
  }, [data]);

  return (
    <Container>
      {loading ? (
        <SpinContainer>
          <PulseLoader color="#212529" size={15} />
        </SpinContainer>
      ) : (
        <ScrollMenu
          data={data.map(
            ({
              type,
              gameid,
              season,
              homeScore,
              awayScore,
              ot,
              shootout,
            }: {
              type: string;
              gameid: string;
              season: string;
              homeScore: number;
              awayScore: number;
              ot: number;
              shootout: number;
            }) => (
              <ScoreBarItem
                isDate={type === 'date'}
                key={gameid}
                data={{ season, homeScore, awayScore, ot, shootout }}
                league={league}
                gameid={gameid}
                HomeIcon={
                  type === 'date' ? null : sprites[teams[+gameid.substr(5, 2)]]
                }
                AwayIcon={
                  type === 'date' ? null : sprites[teams[+gameid.substr(7, 2)]]
                }
              />
            )
          )}
          translate={-189 * (data.length / 4)}
          wheel={false}
          arrowLeft={
            <Arrow right={false} aria-label="Go Left">
              <BsChevronLeft size="30px" aria-label="Arrow Pointing Left" />
            </Arrow>
          }
          arrowRight={
            <Arrow right={true} aria-label="Go Right">
              <BsChevronRight size="30px" aria-label="Arrow Pointing Right" />
            </Arrow>
          }
          useButtonRole={false}
          menuStyle={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
          }}
          alignCenter={false}
        />
      )}
    </Container>
  );
}

const SpinContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  height: 93px;
  background-color: ${({ theme }) => theme.colors.grey100};

  & .scroll-menu-arrow,
  & .menu-wrapper,
  & .menu-wrapper--inner,
  & .menu-item-wrapper {
    height: 100%;
  }

  & .menu-wrapper--inner {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  & .scroll-menu-arrow--disabled {
    visibility: hidden;
  }
`;

const Arrow = styled.div<{ right: boolean }>`
  position: relative;
  width: 45px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ right }) => (right ? `-` : ``)}2px 0 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 2;

  & > * {
    color: ${({ theme }) => theme.colors.grey900};
  }
`;

export default React.memo(ScoreBar);
