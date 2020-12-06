import React from 'react';
import { Team } from '..';

import { Game } from '../pages/api/v1/schedule';

interface GameDayHeaderProps {
  date: string;
}

const GameDayHeader = ({ date }: GameDayHeaderProps): JSX.Element => (<h2>{date}</h2>);

interface GameDayMatchupProps {
  game: Game;
  teamlist: Array<Team>;
}

const GameDayMatchup = ({ game, teamlist }: GameDayMatchupProps): JSX.Element => {
  // const { awayTeam, awayScore, homeTeam, homeScore, played, overtime, shootout } = game;
  // const awayTeamWon = awayScore > homeScore;
  // const awayTeamObject = teamlist.find(team => team.id === awayTeam);
  // const awayTeamName = awayTeamObject && awayTeamObject.name ? awayTeamObject.name : 'Away Team';
  // const homeTeamObject = teamlist.find(team => team.id === homeTeam);
  // const homeTeamName = homeTeamObject && homeTeamObject.name ? homeTeamObject.name : 'Home Team';
  console.log(game, teamlist);
  return <div>game</div>;
}

interface GameDayScheduleProps {
  date: string;
  games: Array<Game>;
  teamlist: Array<Team>;
}

function GameDaySchedule({ date, games, teamlist }: GameDayScheduleProps): JSX.Element {
  const renderGameDayMatchups = () => games.map((game, i) => (
    <GameDayMatchup key={i} game={game} teamlist={teamlist} />
  ));

  return (
    <>
      <GameDayHeader date={date} />
      {renderGameDayMatchups()}
    </>
  );
}

export default GameDaySchedule;
