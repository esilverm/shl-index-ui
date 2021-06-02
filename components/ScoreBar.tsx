import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { PulseLoader } from 'react-spinners';

import ScoreBarItem from './ScoreBarItem';

// Determine prop types when actually implementing in conjunction with backend
interface Props {
  data: Array<{
    date: string;
    played: number;
    games: Array<{
      slug: string;
      date: string;
      homeTeam: string;
      homeScore: number;
      awayTeam: string;
      awayScore: number;
      overtime: number;
      shootout: number;
      played: number;
    }>;
  }>;
  loading: boolean;
  league: string;
}

function ScoreBar({ data, loading, league }: Props): JSX.Element {
  const [isloadingAssets, setLoadingAssets] = useState<boolean>(true);
  const [sprites, setSprites] = useState<{
    [index: string]: React.ComponentClass<any>;
  }>({});

  // {
  //   date: string;
  //   games: Array<{slug: string; date: string; home: string; homeScore: number; away: string; awayScore: number; overtime: number; shootout: number;}>
  // })

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

  return (
    <Container>
      {loading || isloadingAssets ? (
        <SpinContainer>
          <PulseLoader color="#212529" size={15} />
        </SpinContainer>
      ) : (
        <ScrollMenu
          data={[].concat(
            ...data.map(({ date, games }) =>
              [
                <ScoreBarItem
                  isDate
                  key={date}
                  gameid={date}
                  league={league}
                />,
              ].concat(
                games.map(
                  ({
                    slug,
                    homeTeam,
                    homeScore,
                    awayTeam,
                    awayScore,
                    overtime,
                    shootout,
                    played,
                  }) => (
                    <ScoreBarItem
                      key={slug}
                      data={{
                        season: slug.substr(0, 2),
                        homeTeam: homeTeam,
                        homeScore: homeScore,
                        awayTeam: awayTeam,
                        awayScore: awayScore,
                        overtime: overtime,
                        shootout: shootout,
                        played: played,
                      }}
                      league={league}
                      gameid={slug}
                      HomeIcon={sprites[homeTeam]}
                      AwayIcon={sprites[awayTeam]}
                    />
                  )
                )
              )
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

export default ScoreBar;
