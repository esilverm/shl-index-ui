import { Player, Goalie } from '../..'

interface Props {
  searchText: string,
  players: Array<Player>,
  goalies: Array<Goalie>
}

interface Filtered {
  players: Array<Player>,
  goalies: Array<Goalie>
}

const searchBarFilterPlayerStats = ({
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

export default searchBarFilterPlayerStats;