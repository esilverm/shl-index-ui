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

const searchBarFilterPlayerRatingsByPosition = ({
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
    return player.position.toLowerCase().includes(text.toLowerCase())
  });

  const filteredGoalies = inputtedGoalies.filter((goalie) => {
    return goalie.position.toLowerCase().includes(text.toLowerCase())
  });

  return {
    players: filteredPlayers,
    goalies: filteredGoalies
  };
}

export default searchBarFilterPlayerRatingsByPosition ;