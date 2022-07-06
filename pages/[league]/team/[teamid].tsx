/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import Error from 'next/error';
import React, { createRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import tinycolor from 'tinycolor2';

// import useSWR from 'swr';
import { PlayerRatings, GoalieRatings, Goalie, Player } from '../../..';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import Line from '../../../components/Lines/Line';
import LinePlayer from '../../../components/Lines/LinePlayer';
import GoalieRatingsTable from '../../../components/RatingsTable/GoalieRatingsTable';
import SkaterRatingsTable from '../../../components/RatingsTable/SkaterRatingsTable';
import GoalieScoreTable from '../../../components/ScoreTable/GoalieScoreTable';
import SkaterAdvStatsTable from '../../../components/ScoreTable/SkaterAdvStatsTable';
import SkaterScoreTable from '../../../components/ScoreTable/SkaterScoreTable';
import SeasonTypeSelector from '../../../components/Selector/SeasonTypeSelector';
import useGoalieRatings from '../../../hooks/useGoalieRatings';
import useRatings from '../../../hooks/useRatings';
import useTeamLines from '../../../hooks/useTeamLines';
import useTeamRosterStats from '../../../hooks/useTeamRosterStats';
import { SeasonType } from '../../api/v1/teams/[id]/roster/stats';

interface Props {
  leaguename: string;
  id: number;
  season: number;
  conference: number;
  division: number;
  name: string;
  nameDetails: { first: string; second: string };
  abbreviation: string;
  location: string;
  colors: { primary: string; secondary: string; text: string };
  stats: {
    wins: number;
    losses: number;
    overtimeLosses: number;
    shootoutWins: number;
    shootoutLosses: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    winPercent: number;
  };
}

// TODO: add team data and make it the first visible option in the selector
const TeamPageDisplays = ['roster', 'lines'] as const;
type TeamPageDisplay = typeof TeamPageDisplays[number];

const SkaterStatsDisplays = ['stats', 'advanced stats', 'ratings'] as const;
type SkaterStatsDisplay = typeof SkaterStatsDisplays[number];

const LinesDisplays = [
  'even strength',
  'power play',
  'penalty kill',
  'goalies',
  'other',
] as const;
type LinesDisplay = typeof LinesDisplays[number];

function TeamPage({
  leaguename,
  id,
  name,
  nameDetails,
  abbreviation,
  location,
  colors,
  stats,
}: Props): JSX.Element {
  if (!name) {
    return <Error statusCode={404} />;
  }

  const [elRefs, setElRefs] = useState({});
  const [, setFilterSeasonType] = useState('Regular Season');
  const { roster, isLoading } = useTeamRosterStats(leaguename, id);
  const { lines, isLoading: isLoadingLines } = useTeamLines(leaguename, id);
  const [display, setDisplay] = useState<SkaterStatsDisplay>('stats');
  const [pageDisplay, setPageDisplay] = useState<TeamPageDisplay>('roster');
  const [linesDisplay, setLinesDisplay] =
    useState<LinesDisplay>('even strength');

  useEffect(() => {
    setElRefs((elRefs) => ({
      ...elRefs,
      'even strength': Array(3)
        .fill(null)
        .map((_, i) => elRefs[i] || createRef()),
      'power play': Array(3)
        .fill(null)
        .map((_, i) => elRefs[i] || createRef()),
      'penalty kill': Array(3)
        .fill(null)
        .map((_, i) => elRefs[i] || createRef()),
    }));
  }, []);

  // Lines are only available for FHM8 exports, so if there is an error on the backend we know that it's not a FHM8 export
  const showLinesTab = React.useMemo(
    () => !isLoadingLines && !('error' in lines),
    [isLoadingLines, lines]
  );

  const rosterSkaters = React.useMemo(
    () =>
      roster
        ? (roster.filter((player) => player.position !== 'G') as Array<Player>)
        : [],
    [roster]
  );
  const rosterGoalies = React.useMemo(
    () =>
      roster
        ? (roster.filter((player) => player.position === 'G') as Array<Goalie>)
        : [],
    [roster]
  );

  // ratings
  const { ratings: skaterratings, isLoading: isLoadingPlayerRatings } =
    useRatings(leaguename);

  const rosterSkaterRatings = React.useMemo(
    () =>
      skaterratings
        ? (skaterratings.filter(
            (player) => player.position !== 'G' && player.team == abbreviation
          ) as Array<PlayerRatings>)
        : [],
    [skaterratings]
  );

  const { ratings: goalieratingdata, isLoading: isLoadingGoalieRatings } =
    useGoalieRatings(leaguename);

  const rosterGoalieRatings = React.useMemo(
    () =>
      goalieratingdata
        ? (goalieratingdata.filter(
            (player) => player.position === 'G' && player.team == abbreviation
          ) as Array<GoalieRatings>)
        : [],
    [goalieratingdata]
  );

  const onSeasonTypeSelect = async (seasonType: SeasonType) => {
    setFilterSeasonType(seasonType);
  };

  return (
    <>
      <NextSeo
        title={name}
        additionalMetaTags={[
          { property: 'theme-color', content: colors.primary },
        ]}
        openGraph={{
          title: name,
        }}
      />
      <Header league={leaguename} activePage="teams" team={id} days={10} />
      <TeamHero {...colors}>
        <TeamLogo
          src={require(`../../../public/team_logos/${leaguename.toUpperCase()}/${location
            .replace('.', '')
            .replace(/white|blue/i, '')
            .trim()
            .split(' ')
            .join('_')}.svg`)}
          alt={`${name} logo`}
        />
        <TeamInfoContainer>
          <TeamName bright={tinycolor(colors.primary).isDark()}>
            <span className="first">{nameDetails.first}</span>
            <span className="second">{nameDetails.second}</span>
          </TeamName>
          <TeamHeaderStats bright={tinycolor(colors.primary).isDark()}>
            <span>
              {stats.wins} - {stats.losses} -{' '}
              {stats.overtimeLosses + stats.shootoutLosses}
            </span>{' '}
            | <span>{stats.points} PTS</span> |{' '}
            <span>{stats.winPercent.toFixed(3)}</span>
          </TeamHeaderStats>
        </TeamInfoContainer>
      </TeamHero>
      <Container>
        {showLinesTab && (
          <DisplaySelectContainer role="tablist">
            {TeamPageDisplays.map((display) => (
              <DisplaySelectItem
                key={display}
                onClick={() => setPageDisplay(display)}
                active={pageDisplay === display}
                tabIndex={0}
                role="tab"
                aria-selected={pageDisplay === display}
                aria-controls={display}
              >
                {display}
              </DisplaySelectItem>
            ))}
          </DisplaySelectContainer>
        )}
        {pageDisplay === 'roster' && (
          <>
            {/* Data for this page that we can also do: Roster, Historical Stats, etc. */}
            <TableHeading>Skaters</TableHeading>
            <Filters>
              <SeasonTypeSelector onChange={onSeasonTypeSelect} />
            </Filters>
            <DisplaySelectContainer role="tablist">
              {SkaterStatsDisplays.map((statsDisplay) => (
                <DisplaySelectItem
                  key={statsDisplay}
                  onClick={() => setDisplay(statsDisplay)}
                  active={display === statsDisplay}
                  tabIndex={0}
                  role="tab"
                  aria-selected={display === statsDisplay}
                  aria-controls={statsDisplay}
                >
                  {statsDisplay}
                </DisplaySelectItem>
              ))}
            </DisplaySelectContainer>
            <TableWrapper>
              {!isLoading && (
                <TableContainer>
                  {display === 'ratings' && !isLoadingPlayerRatings ? (
                    <SkaterRatingsTable data={rosterSkaterRatings} teamPage />
                  ) : display === 'stats' ? (
                    <SkaterScoreTable data={rosterSkaters} teamPage />
                  ) : (
                    <SkaterAdvStatsTable data={rosterSkaters} teamPage />
                  )}
                </TableContainer>
              )}
            </TableWrapper>
            <TableHeading>Goalies</TableHeading>
            <TableWrapper>
              {!isLoading && (
                <TableContainer>
                  {display === 'ratings' && !isLoadingGoalieRatings ? (
                    <GoalieRatingsTable data={rosterGoalieRatings} teamPage />
                  ) : (
                    <GoalieScoreTable data={rosterGoalies} teamPage />
                  )}
                </TableContainer>
              )}
            </TableWrapper>
          </>
        )}
        {showLinesTab && pageDisplay === 'lines' && (
          <>
            {/* <TableHeading>Team Lines</TableHeading> */}
            <DisplaySelectContainer role="tablist">
              {LinesDisplays.map((linesDisplayItem) => (
                <DisplaySelectItem
                  key={linesDisplayItem}
                  onClick={() => setLinesDisplay(linesDisplayItem)}
                  active={linesDisplay === linesDisplayItem}
                  tabIndex={0}
                  role="tab"
                  aria-selected={linesDisplay === linesDisplayItem}
                  aria-controls={linesDisplayItem}
                >
                  {linesDisplayItem}
                </DisplaySelectItem>
              ))}
            </DisplaySelectContainer>
            {linesDisplay === 'even strength' && (
              <>
                {Object.keys(lines['ES']).map((lineType, i) => (
                  <React.Fragment key={lineType}>
                    <LineTypeText>
                      {lineType.split('on').join(' on ')}
                    </LineTypeText>
                    <LineContainer>
                      <div
                        className="left"
                        onClick={() => {
                          elRefs[linesDisplay][i].current.scrollLeft -=
                            elRefs[linesDisplay][i].current.clientWidth;
                        }}
                      >
                        &lt;
                      </div>
                      <LineGroupContainer
                        key={lineType}
                        ref={elRefs[linesDisplay][i]}
                      >
                        {Object.keys(lines['ES'][lineType]).map(
                          (key, index) =>
                            Object.keys(lines['ES'][lineType][key]).length >
                              0 && (
                              <LineWrapper>
                                <h4>
                                  {index + 1}
                                  {['st', 'nd', 'rd'][index]} Line
                                </h4>
                                <Line
                                  key={key}
                                  league={leaguename}
                                  lineup={lines['ES'][lineType][key]}
                                />
                              </LineWrapper>
                            )
                        )}
                      </LineGroupContainer>
                      <div
                        className="right"
                        onClick={() => {
                          elRefs[linesDisplay][i].current.scrollLeft +=
                            elRefs[linesDisplay][i].current.clientWidth;
                        }}
                      >
                        &gt;
                      </div>
                    </LineContainer>
                  </React.Fragment>
                ))}
              </>
            )}
            {linesDisplay === 'power play' && (
              <>
                {Object.keys(lines['PP']).map((lineType, i) => (
                  <React.Fragment key={lineType}>
                    <LineTypeText>
                      {lineType.split('on').join(' on ')}
                    </LineTypeText>
                    <LineContainer>
                      <div
                        className="left"
                        onClick={() => {
                          elRefs[linesDisplay][i].current.scrollLeft -=
                            elRefs[linesDisplay][i].current.clientWidth;
                        }}
                      >
                        &lt;
                      </div>
                      <LineGroupContainer
                        key={lineType}
                        ref={elRefs[linesDisplay][i]}
                      >
                        {Object.keys(lines['PP'][lineType]).map(
                          (key, index) =>
                            Object.keys(lines['PP'][lineType][key]).length >
                              0 && (
                              <LineWrapper>
                                <h4>
                                  {index + 1}
                                  {['st', 'nd', 'rd'][index]} Line
                                </h4>
                                <Line
                                  key={key}
                                  league={leaguename}
                                  lineup={lines['PP'][lineType][key]}
                                />
                              </LineWrapper>
                            )
                        )}
                      </LineGroupContainer>
                      <div
                        className="right"
                        onClick={() => {
                          elRefs[linesDisplay][i].current.scrollLeft +=
                            elRefs[linesDisplay][i].current.clientWidth;
                        }}
                      >
                        &gt;
                      </div>
                    </LineContainer>
                  </React.Fragment>
                ))}
              </>
            )}
            {linesDisplay === 'penalty kill' && (
              <>
                {Object.keys(lines['PK']).map((lineType, i) => (
                  <React.Fragment key={lineType}>
                    <LineTypeText>
                      {lineType.split('on').join(' on ')}
                    </LineTypeText>
                    <LineContainer>
                      <div
                        className="left"
                        onClick={() => {
                          elRefs[linesDisplay][i].current.scrollLeft -=
                            elRefs[linesDisplay][i].current.clientWidth;
                        }}
                      >
                        &lt;
                      </div>
                      <LineGroupContainer
                        key={lineType}
                        ref={elRefs[linesDisplay][i]}
                      >
                        {Object.keys(lines['PK'][lineType]).map(
                          (key, index) =>
                            Object.keys(lines['PK'][lineType][key]).length >
                              0 && (
                              <LineWrapper>
                                <h4>
                                  {index + 1}
                                  {['st', 'nd', 'rd'][index]} Line
                                </h4>
                                <Line
                                  key={key}
                                  league={leaguename}
                                  lineup={lines['PK'][lineType][key]}
                                />
                              </LineWrapper>
                            )
                        )}
                      </LineGroupContainer>
                      <div
                        className="right"
                        onClick={() => {
                          elRefs[linesDisplay][i].current.scrollLeft +=
                            elRefs[linesDisplay][i].current.clientWidth;
                        }}
                      >
                        &gt;
                      </div>
                    </LineContainer>
                  </React.Fragment>
                ))}
              </>
            )}
            {linesDisplay === 'goalies' && (
              <GoaliesContainer>
                <LinePlayer
                  player={lines['goalies']['starter']}
                  league={leaguename}
                  position="Starter"
                />
                <LinePlayer
                  player={lines['goalies']['backup']}
                  league={leaguename}
                  position="Backup"
                />
              </GoaliesContainer>
            )}
            {linesDisplay === 'other' && (
              <OtherContainer>
                <div>
                  <h3>Shootout Order</h3>
                  {lines['shootout'].map((player, i) => (
                    <LinePlayer
                      key={player.id}
                      player={player}
                      league={leaguename}
                      position={`Shootout ${i + 1}`}
                    />
                  ))}
                </div>
                <div>
                  <h3>Extra Attackers</h3>
                  {lines['extraAttackers'].map((player) => (
                    <LinePlayer
                      key={player.id}
                      player={player}
                      league={leaguename}
                      position="Extra Attacker"
                    />
                  ))}
                </div>
              </OtherContainer>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
}

// TODO Add better styling
const Container = styled.div`
  width: 75%;
  padding: 1px 0 40px 0;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.grey100};

  @media screen and (max-width: 1024px) {
    width: 100%;
    padding: 2.5%;
  }
`;

const Filters = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 3%;
  justify-content: flex-end;
  float: right;
  margin-top: -88px;

  button {
    width: 200px;
  }

  @media screen and (max-width: 750px) {
    flex-direction: column;
    align-items: center;

    button {
      margin-right: 0;
      margin-bottom: 5px;
      width: 150px;
    }
  }
`;

const TeamHero = styled.div<{
  primary: string;
  secondary: string;
  text: string;
}>`
  width: 100%;
  padding: 0 12.5%;
  min-height: 300px;
  height: 40vh;
  background-color: ${({ primary }) => primary};
  display: flex;
  flex-direction: row;
  align-items: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding: 0;
    padding-top: 5%;
    padding-bottom: 5%;
  }
`;

const TeamLogo = styled.img`
  height: 60%;
  filter: drop-shadow(0 0 1.15rem rgba(0, 0, 0, 0.4));
  margin: 0 5%;
`;

const TeamInfoContainer = styled.div`
  height: 30%;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const TeamName = styled.h1<{ bright: boolean }>`
  color: ${({ bright, theme }) =>
    bright ? theme.colors.grey100 : theme.colors.grey900};
  span {
    display: block;
  }

  span.first {
    font-family: Montserrat, sans-serif;
    font-weight: 400;
    letter-spacing: 0.1rem;
  }

  span.second {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15rem;
  }
`;

const TeamHeaderStats = styled.h3<{ bright: boolean }>`
  color: ${({ bright, theme }) =>
    bright ? theme.colors.grey100 : theme.colors.grey900};
  font-weight: 400;
  font-size: 1.1rem;
  font-family: Montserrat, sans-serif;

  span {
    margin-right: 1rem;
  }

  * + span {
    margin-left: 1rem;
  }

  span:last-child {
    margin-right: 0;
  }
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
  text-transform: capitalize;
`;

const TableWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

const TableContainer = styled.div`
  width: 100%;
  margin: 30px 0;
`;

const TableHeading = styled.h2`
  width: 95%;
  margin: 30px auto;
  font-size: 2.2rem;
  padding: 5px 0;
  border-bottom: 1px solid black;
`;

// horizontal scrolling container for divs
const LineGroupContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(3, 100%);
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  scroll-snap-type: x mandatory;
  scroll-snap-stop: always;
  scroll-behavior: smooth;

  overscroll-behavior-x: contain;
`;

const LineTypeText = styled.div`
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  font-size: 2rem;
  width: 40%;
  margin: 0 auto;
  padding: 20px 0;
  text-align: center;
  border-bottom: 1px solid black;
`;

const LineContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
  margin: 0 auto;

  & > div.left,
  & > div.right {
    font-family: Montserrat, sans-serif;
    font-weight: 400;
    font-size: 3rem;
    cursor: pointer;
    margin: 20px;
  }
`;

const LineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  & h4 {
    font-family: Montserrat, sans-serif;
    font-weight: 400;
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
`;

const GoaliesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;

  & div {
    flex: 1;
  }
`;

const OtherContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-start;
  width: 100%;

  & div {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    & h3 {
      font-size: 1.7rem;
    }
    & div {
      flex: 1;
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { league: leaguename, teamid, season } = ctx.query;
    const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(
      typeof leaguename === 'string' ? leaguename : 'shl'
    );

    const teamdata = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_ENDPOINT
      }/api/v1/teams/${teamid}?league=${leagueid}${
        season ? `&season=${season}` : ``
      }`
    ).then((res) => res.json());

    return { props: { leaguename, ...teamdata } };
  } catch (error) {
    ctx.res.statusCode = 404;

    return { props: { error } };
  }
};

export default TeamPage;
