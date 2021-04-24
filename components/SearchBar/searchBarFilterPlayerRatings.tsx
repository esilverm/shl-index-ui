import { PlayerRatings, GoalieRatings } from '../..'

interface Props {
  searchText: string,
  players: Array<PlayerRatings>,
  goalies: Array<GoalieRatings>
}

interface Filtered {
  players: Array<PlayerRatings>,
  goalies: Array<GoalieRatings>
}

const searchBarFilterPlayerRatings = ({
  searchText: text,
  players: inputtedPlayers,
  goalies: inputtedGoalies,
  }: Props): Filtered => {
  
  // if nothing to filter, return the originals
  if (!text || text == '' || !inputtedPlayers || !inputtedGoalies) {
    return {
      players: inputtedPlayers,
      goalies: inputtedGoalies
    };
  }
  
  const filteredPlayers = inputtedPlayers.filter((player) => {
    return player.name.toLowerCase().includes(text.toLowerCase())
  });

  const filteredGoalies = inputtedGoalies.filter((goalie) => {
    return goalie.name.toLowerCase().includes(text.toLowerCase())
  });

  return {
    players: filteredPlayers,
    goalies: filteredGoalies
  };
}

export default searchBarFilterPlayerRatings;