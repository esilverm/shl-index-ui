import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import DoubleBracket from '../../components/PlayoffsBracket/DoubleBracket';
import SingleBracket from '../../components/PlayoffsBracket/SingleBracket';
import SeasonTypeSelector from '../../components/Selector/SeasonTypeSelector';
import StandingsTable from '../../components/StandingsTable';
import useStandings from '../../hooks/useStandings';
import useWindowSize from '../../hooks/useWindowSize';
import { SeasonType } from '../api/v1/schedule';
import { Standings as StandingsData } from '../api/v1/standings';
import { PlayoffsRound } from '../api/v1/standings/playoffs';

interface Props {
  league: string;
}

function Standings({ league }: Props): JSX.Element {
  const [display, setDisplay] = useState('league');
  const [seasonType, setSeasonType] = useState<SeasonType>('Regular Season');
  const [isPlayoffs, setIsPlayoffs] = useState(false);
  const { data, isLoading } = useStandings(league, display, seasonType);
  const windowSize = useWindowSize();

  const onSeasonTypeSelect = (type) => {
    setIsPlayoffs(type === 'Playoffs');
    setSeasonType(type);
  };

  const renderDoublePlayoffsBracket = useCallback(
    () =>
      // The double bracket needs enough space to properly render
      // We use the single bracket when the window is too small or if we have too few series in the first round
      data &&
      data[0] &&
      (data[0] as PlayoffsRound).length > 4 &&
      windowSize.width > 1370,
    [windowSize, data]
  );

  return (
    <React.Fragment>
      <NextSeo
        title="Standings"
        openGraph={{
          title: 'Standings',
        }}
      />
      <Header league={league} activePage="standings" />
      <Container>
        <Filters hideTabList={isPlayoffs}>
          <SelectorWrapper>
            <SeasonTypeSelector onChange={onSeasonTypeSelect} />
          </SelectorWrapper>
          <DisplaySelectContainer role="tablist">
            <DisplaySelectItem
              onClick={() => setDisplay(() => 'league')}
              active={display === 'league'}
              tabIndex={0}
              role="tab"
              aria-selected={display === 'league'}
            >
              League
            </DisplaySelectItem>
            <DisplaySelectItem
              onClick={() => setDisplay(() => 'conference')}
              active={display === 'conference'}
              tabIndex={0}
              role="tab"
              aria-selected={display === 'conference'}
            >
              Conference
            </DisplaySelectItem>
            {league !== 'iihf' && league !== 'wjc' && (
              <DisplaySelectItem
                onClick={() => setDisplay(() => 'division')}
                active={display === 'division'}
                tabIndex={0}
                role="tab"
                aria-selected={display === 'division'}
              >
                Division
              </DisplaySelectItem>
            )}
          </DisplaySelectContainer>
        </Filters>
        <Main>
          {isPlayoffs && !renderDoublePlayoffsBracket() && (
            <SingleBracket
              data={data as Array<PlayoffsRound>}
              league={league}
            />
          )}
          {isPlayoffs && renderDoublePlayoffsBracket() && (
            <DoubleBracket
              data={data as Array<PlayoffsRound>}
              league={league}
            />
          )}
          {!isPlayoffs && (
            <StandingsTableWrapper>
              {Array.isArray(data) &&
              data.length > 0 &&
              'teams' in data[0] &&
              !isLoading ? (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data.map((group, i) => (
                  <StandingsTableContainer key={i}>
                    <StandingsTable
                      data={group.teams}
                      league={league}
                      title={group.name}
                      isLoading={isLoading}
                    />
                  </StandingsTableContainer>
                ))
              ) : (
                <StandingsTable
                  data={data as StandingsData}
                  league={league}
                  isLoading={isLoading}
                />
              )}
            </StandingsTableWrapper>
          )}
        </Main>
      </Container>
      <Footer />
    </React.Fragment>
  );
}

const Container = styled.div`
  height: 100%;
  width: 75%;
  padding: 1px 0 40px 0;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.grey100};

  @media screen and (max-width: 1820px) {
    width: 85%;
  }

  @media screen and (max-width: 1610px) {
    width: 100%;
  }

  @media screen and (max-width: 1024px) {
    padding: 2.5%;
  }
`;

const Filters = styled.div<{
  hideTabList: boolean;
}>`
  [role='tablist'] {
    display: ${(props) => (props.hideTabList ? 'none' : 'block')};
  }

  button {
    ${(props) => props.hideTabList && 'margin-top: 28px;'}
  }

  @media screen and (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      margin-right: 0;
      margin-bottom: 5px;
    }
  }
`;

const SelectorWrapper = styled.div`
  width: 250px;
  float: right;
  margin-right: 3%;
`;

const Main = styled.main`
  height: 100%;
  width: 100%;
`;

const DisplaySelectContainer = styled.div`
  margin: 28px auto;
  width: 95%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
`;

const DisplaySelectItem = styled.div<{ active: boolean }>`
  display: inline-block;
  padding: 8px 24px;
  border: 1px solid
    ${({ theme, active }) => (active ? theme.colors.grey500 : 'transparent')};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.grey100 : 'transparent'};
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  position: relative;
  border-bottom: none;
  bottom: -1px;
`;

const StandingsTableWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

const StandingsTableContainer = styled.div`
  width: 100%;
  margin: 30px 0;
`;

export const getStaticPaths: GetStaticPaths = async () => {
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];

  const paths = leagues.map((league) => ({
    params: { league },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return { props: { league: ctx.params.league } };
};

export default Standings;
