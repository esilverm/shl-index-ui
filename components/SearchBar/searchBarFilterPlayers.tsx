import { Player, Goalie, PlayerRatings, GoalieRatings } from '../..'

interface Props {
  searchText: string,
  searchType: string,
  players: Array<Player | PlayerRatings>,
  goalies: Array<Goalie | GoalieRatings>
}

interface Filtered {
  players: Array<Player | PlayerRatings>,
  goalies: Array<Goalie | GoalieRatings>
}

const searchBarFilterPlayers = ({
  searchText: text,
  searchType: searchType,
  players: inputtedPlayers,
  goalies: inputtedGoalies,
  }: Props): Filtered => {

  // if nothing to filter, return the originals
  if (!text || text === '' || !inputtedPlayers || !inputtedGoalies) {
    return {
      players: inputtedPlayers,
      goalies: inputtedGoalies
    };
  }

  const filteredPlayers = searchType.toLowerCase() === 'name' ? inputtedPlayers.filter((player) => {
    return player.name.toLowerCase().includes(text.toLowerCase())
    }) : inputtedPlayers.filter((player) => { return player.position.toLowerCase().includes(text.toLowerCase())
    });

  const filteredGoalies = searchType.toLowerCase() === 'name' ? inputtedGoalies.filter((player) => {
    return player.name.toLowerCase().includes(text.toLowerCase())
    }) : inputtedGoalies.filter((player) => { return player.position.toLowerCase().includes(text.toLowerCase())
    });

  return {
    players: filteredPlayers,
    goalies: filteredGoalies
  };
}

export default searchBarFilterPlayers;
