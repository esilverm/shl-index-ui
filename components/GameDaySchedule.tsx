import React from 'react';
import { Team } from '..';

import { Game } from '../pages/api/v1/schedule';

interface GameDayHeaderProps {
  date: string;
}

function GameDayHeader({ _date }: GameDayHeaderProps): JSX.Element {
  return <span>header</span>;
}

interface GameDayMatchupProps {
  game: Game;
}

function GameDayMatchup({ _game }: GameDayMatchupProps): JSX.Element {
  return <span>game</span>;
}

interface GameDayScheduleProps {
  date: string;
  games: Array<Game>;
  _teamlist: Array<Team>;
}

function GameDaySchedule({ date, games, _teamlist }: GameDayScheduleProps): JSX.Element {
  const renderGameDayMatchups = () => games.map((game, i) => (
    <GameDayMatchup key={i} game={game} />
  ));

  return (
    <>
      <GameDayHeader date={date} />
      {renderGameDayMatchups()}
    </>
  );
}

export default GameDaySchedule;
