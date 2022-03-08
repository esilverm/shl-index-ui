import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import React, { useState } from 'react';
import styled from 'styled-components';

import Layout from '../../../components/STHS/Layout';
import StandingsTable from '../../../components/STHS/StandingsTable';
import useStandings from '../../../hooks/useStandings';
import { Standings as StandingsData } from '../../api/v1/standings';

interface Props {
  league: string;
}

function Standings({ league }: Props): JSX.Element {
  const [display, setDisplay] = useState('conference');
  const { data, isLoading } = useStandings(league, display, 'Regular Season');

  return (
    <React.Fragment>
      <NextSeo
        title="Standings"
        openGraph={{
          title: 'Standings',
        }}
      />
      <Layout league={league} activePage="Pro League">
        <PageHeader>Pro Standing</PageHeader>
        <PageSizeWarning>
          Your browser screen resolution is too small for this page. Some
          information are hidden to keep the page readable.
        </PageSizeWarning>

        <Container>
          <DisplaySelectContainer role="tablist">
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
            <DisplaySelectItem
              onClick={() => setDisplay(() => 'league')}
              active={display === 'league'}
              tabIndex={0}
              role="tab"
              aria-selected={display === 'league'}
            >
              Overall
            </DisplaySelectItem>
          </DisplaySelectContainer>
          <Main>
            <StandingsTableWrapper>
              {Array.isArray(data) &&
              data.length > 0 &&
              'teams' in data[0] &&
              !isLoading ? (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data.map((group, i) => (
                  <StandingsTableContainer key={i}>
                    <GroupName>{group.name}</GroupName>
                    <StandingsTable
                      data={group.teams}
                      league={league}
                      title={group.name}
                      isLoading={isLoading}
                    />
                  </StandingsTableContainer>
                ))
              ) : (
                <React.Fragment>
                  <GroupName>Overall</GroupName>
                  <StandingsTable
                    data={data as StandingsData}
                    league={league}
                    isLoading={isLoading}
                  />
                </React.Fragment>
              )}
            </StandingsTableWrapper>

            <GroupName>Point System</GroupName>
            <p>
              <strong>Win</strong> : 2 -- <strong>Loss</strong> : 1 --{' '}
              <strong>OT Win</strong> : 2 -- <strong>OT Loss</strong> : 1 --{' '}
              <strong>SO Win</strong> : 2 -- <strong>SO Loss</strong> : 1
            </p>
            <p>
              P.S. The simulator only uses points to give the title. If two team
              have the same amount of point, none of them will be award the
              title until your simulate the last game/day of your season.
            </p>
          </Main>
        </Container>
      </Layout>
    </React.Fragment>
  );
}

const PageHeader = styled.div`
  text-align: left;
  font-weight: bold;
  font-size: 1.6em;
  padding-bottom 9px;
  padding-left: 9px;
`;

const PageSizeWarning = styled.div`
  display: none;
  color: #ff0000;
  font-weight: bold;
  padding: 1px 1px 1px 5px;
  text-align: center;

  @media screen and (max-width: 1060px) {
    display: block;
  }
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const GroupName = styled.div`
  font-size: 20px;
  font-family: Georgia, Tahoma;
  font-weight: 400p;
  line-height: 100%;
  margin: 12px;
`;

const Main = styled.main`
  height: 100%;
  width: 100%;
`;

const DisplaySelectContainer = styled.div`
  margin: 28px auto;
  width: 95%;
`;

const DisplaySelectItem = styled.div<{ active: boolean }>`
  display: inline-block;
  padding: 0 24px;
  text-decoration: ${({ active }) => (!active ? 'underline' : 'none')};
  font-size: 16px;
  font-weight: 600;
  color: #4c4c4c;
  cursor: pointer;
  position: relative;
  border-bottom: none;
`;

const StandingsTableWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

const StandingsTableContainer = styled.div`
  width: 100%;
  margin-bottom: 40px;
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
