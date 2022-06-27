import React from 'react';
import styled from 'styled-components';

export const getPlayerShortname = (name: string): string => {
  const splitName = name.split(' ');
  if (splitName.length === 1) {
    return name;
  } else if (
    splitName.length === 2 ||
    splitName[splitName.length - 1].toLowerCase().includes('jr') ||
    splitName[splitName.length - 1].toLowerCase().includes('sr') ||
    splitName[splitName.length - 1].match(
      /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/
    )
  ) {
    // get first alphanumeric character of first name
    const firstChar = splitName[0].match(/[a-zA-Z0-9]/)[0];

    // if ends with jr
    if (
      splitName[splitName.length - 1].toLowerCase().includes('jr') ||
      splitName[splitName.length - 1].toLowerCase().includes('sr') ||
      splitName[splitName.length - 1].match(
        /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/
      )
    ) {
      return `${firstChar}. ${splitName[splitName.length - 2]} ${
        splitName[splitName.length - 1]
      }`;
    }

    return `${firstChar}. ${splitName[1]}`;
  }
  const shortName = splitName.slice(0, -1).reduce((acc, curr) => {
    const firstChar = curr.match(/[a-zA-Z0-9]/);
    if (firstChar) {
      return acc + `${firstChar[0]}. `;
    }
    return acc;
  }, '');
  return `${shortName}${splitName.slice(-1)}`;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const BoxscoreTeamRosters = ({ gameData }): JSX.Element => {
  const { teams, boxscore } = gameData;
  const { away, home } = boxscore;

  return (
    <TeamsPreview>
      {/* Away Team */}
      <TeamTableContainer>
        <TeamName>
          {teams.away.name} {teams.away.nickname}
        </TeamName>
        <TeamRosterTableHeader>
          <PlayerInfoContainer>
            <PlayerInfoStatHeader>Skaters</PlayerInfoStatHeader>
          </PlayerInfoContainer>
          <PlayerStatHeader>GR</PlayerStatHeader>
          <PlayerStatHeader>OGR</PlayerStatHeader>
          <PlayerStatHeader>DGR</PlayerStatHeader>
          <PlayerStatHeader>G</PlayerStatHeader>
          <PlayerStatHeader>A</PlayerStatHeader>
          <PlayerStatHeader>P</PlayerStatHeader>
          <PlayerStatHeader>+/-</PlayerStatHeader>
          <PlayerStatHeader>SOG</PlayerStatHeader>
          <PlayerStatHeader>BS</PlayerStatHeader>
          <PlayerStatHeader>PIM</PlayerStatHeader>
          <PlayerStatHeader>HIT</PlayerStatHeader>
          <PlayerStatHeader>TA</PlayerStatHeader>
          <PlayerStatHeader>GA</PlayerStatHeader>
          <PlayerStatHeader>SHF</PlayerStatHeader>
          <PlayerStatHeader long>TOT</PlayerStatHeader>
          <PlayerStatHeader long>PP</PlayerStatHeader>
          <PlayerStatHeader long>SH</PlayerStatHeader>
          <PlayerStatHeader>FO%</PlayerStatHeader>
        </TeamRosterTableHeader>
        {away.skaters.map(
          (player): JSX.Element => (
            <TeamRosterTableRow key={player.id}>
              <PlayerInfoContainer>
                <div>{getPlayerShortname(player.name)}</div>
              </PlayerInfoContainer>
              <PlayerStat>{player.gameRating}</PlayerStat>
              <PlayerStat>{player.offensiveGameRating}</PlayerStat>
              <PlayerStat>{player.defensiveGameRating}</PlayerStat>
              <PlayerStat>{player.goals}</PlayerStat>
              <PlayerStat>{player.assists}</PlayerStat>
              <PlayerStat>{player.goals + player.assists}</PlayerStat>
              <PlayerStat>
                {player.plusMinus > 0 ? '+' : ''}
                {player.plusMinus}
              </PlayerStat>
              <PlayerStat>{player.shots}</PlayerStat>
              <PlayerStat>{player.blocks}</PlayerStat>
              <PlayerStat>{player.pim}</PlayerStat>
              <PlayerStat>{player.hits}</PlayerStat>
              <PlayerStat>{player.takeaways}</PlayerStat>
              <PlayerStat>{player.giveaways}</PlayerStat>
              <PlayerStat>{player.shifts}</PlayerStat>
              <PlayerStat long>{player.timeOnIce}</PlayerStat>
              <PlayerStat long>{player.ppTimeOnIce}</PlayerStat>
              <PlayerStat long>{player.shTimeOnIce}</PlayerStat>
              <PlayerStat
                {...(player.faceoffs > 0 && {
                  title: `${player.faceoffWins}/${player.faceoffs} Faceoffs Won`,
                })}
              >
                {player.faceoffs > 0
                  ? `${((player.faceoffWins * 100) / player.faceoffs).toFixed(
                      1
                    )}%`
                  : '-'}
              </PlayerStat>
            </TeamRosterTableRow>
          )
        )}
        <TeamRosterTableHeader>
          <PlayerInfoContainer>
            <PlayerInfoStatHeader>Goalies</PlayerInfoStatHeader>
          </PlayerInfoContainer>
          <PlayerStatHeader>GR</PlayerStatHeader>
          <PlayerStatHeader>SA</PlayerStatHeader>
          <PlayerStatHeader>GA</PlayerStatHeader>
          <PlayerStatHeader>SV</PlayerStatHeader>
          <PlayerStatHeader>SV%</PlayerStatHeader>
          <PlayerStatHeader long>TOI</PlayerStatHeader>
          <PlayerStatHeader>PIM</PlayerStatHeader>
        </TeamRosterTableHeader>
        {away.goalies.map(
          (player): JSX.Element =>
            player.minutesPlayed !== '00:00' && (
              <TeamRosterTableRow key={player.id}>
                <PlayerInfoContainer>
                  <div>{getPlayerShortname(player.name)}</div>
                </PlayerInfoContainer>
                <PlayerStat>{player.gameRating}</PlayerStat>
                <PlayerStat>{player.shotsAgainst}</PlayerStat>
                <PlayerStat>{player.goalsAgainst}</PlayerStat>
                <PlayerStat>{player.saves}</PlayerStat>
                <PlayerStat>{player.savePct.toFixed(3)}</PlayerStat>
                <PlayerStat long>{player.minutesPlayed}</PlayerStat>
                <PlayerStat>{player.pim}</PlayerStat>
              </TeamRosterTableRow>
            )
        )}
      </TeamTableContainer>
      {/* Home Team */}
      <TeamTableContainer>
        <TeamName>
          {teams.home.name} {teams.home.nickname}
        </TeamName>
        <TeamRosterTableHeader>
          <PlayerInfoContainer>
            <PlayerInfoStatHeader>Skaters</PlayerInfoStatHeader>
          </PlayerInfoContainer>
          <PlayerStatHeader>GR</PlayerStatHeader>
          <PlayerStatHeader>OGR</PlayerStatHeader>
          <PlayerStatHeader>DGR</PlayerStatHeader>
          <PlayerStatHeader>G</PlayerStatHeader>
          <PlayerStatHeader>A</PlayerStatHeader>
          <PlayerStatHeader>P</PlayerStatHeader>
          <PlayerStatHeader>+/-</PlayerStatHeader>
          <PlayerStatHeader>SOG</PlayerStatHeader>
          <PlayerStatHeader>BS</PlayerStatHeader>
          <PlayerStatHeader>PIM</PlayerStatHeader>
          <PlayerStatHeader>HIT</PlayerStatHeader>
          <PlayerStatHeader>TA</PlayerStatHeader>
          <PlayerStatHeader>GA</PlayerStatHeader>
          <PlayerStatHeader>SHF</PlayerStatHeader>
          <PlayerStatHeader long>TOT</PlayerStatHeader>
          <PlayerStatHeader long>PP</PlayerStatHeader>
          <PlayerStatHeader long>SH</PlayerStatHeader>
          <PlayerStatHeader>FO%</PlayerStatHeader>
        </TeamRosterTableHeader>
        {home.skaters.map(
          (player): JSX.Element => (
            <TeamRosterTableRow key={player.id}>
              <PlayerInfoContainer>
                <div>{getPlayerShortname(player.name)}</div>
              </PlayerInfoContainer>
              <PlayerStat>{player.gameRating}</PlayerStat>
              <PlayerStat>{player.offensiveGameRating}</PlayerStat>
              <PlayerStat>{player.defensiveGameRating}</PlayerStat>
              <PlayerStat>{player.goals}</PlayerStat>
              <PlayerStat>{player.assists}</PlayerStat>
              <PlayerStat>{player.goals + player.assists}</PlayerStat>
              <PlayerStat>
                {player.plusMinus > 0 ? '+' : ''}
                {player.plusMinus}
              </PlayerStat>
              <PlayerStat>{player.shots}</PlayerStat>
              <PlayerStat>{player.blocks}</PlayerStat>
              <PlayerStat>{player.pim}</PlayerStat>
              <PlayerStat>{player.hits}</PlayerStat>
              <PlayerStat>{player.takeaways}</PlayerStat>
              <PlayerStat>{player.giveaways}</PlayerStat>
              <PlayerStat>{player.shifts}</PlayerStat>
              <PlayerStat long>{player.timeOnIce}</PlayerStat>
              <PlayerStat long>{player.ppTimeOnIce}</PlayerStat>
              <PlayerStat long>{player.shTimeOnIce}</PlayerStat>
              <PlayerStat>
                {player.faceoffs > 0
                  ? `${((player.faceoffWins * 100) / player.faceoffs).toFixed(
                      1
                    )}%`
                  : '-'}
              </PlayerStat>
            </TeamRosterTableRow>
          )
        )}
        <TeamRosterTableHeader>
          <PlayerInfoContainer>
            <PlayerInfoStatHeader>Goalies</PlayerInfoStatHeader>
          </PlayerInfoContainer>
          <PlayerStatHeader>GR</PlayerStatHeader>
          <PlayerStatHeader>SA</PlayerStatHeader>
          <PlayerStatHeader>GA</PlayerStatHeader>
          <PlayerStatHeader>SV</PlayerStatHeader>
          <PlayerStatHeader>SV%</PlayerStatHeader>
          <PlayerStatHeader long>TOI</PlayerStatHeader>
          <PlayerStatHeader>PIM</PlayerStatHeader>
        </TeamRosterTableHeader>
        {home.goalies.map(
          (player): JSX.Element =>
            player.minutesPlayed !== '00:00' && (
              <TeamRosterTableRow key={player.id}>
                <PlayerInfoContainer>
                  <div>{getPlayerShortname(player.name)}</div>
                </PlayerInfoContainer>
                <PlayerStat>{player.gameRating}</PlayerStat>
                <PlayerStat>{player.shotsAgainst}</PlayerStat>
                <PlayerStat>{player.goalsAgainst}</PlayerStat>
                <PlayerStat>{player.saves}</PlayerStat>
                <PlayerStat>{player.savePct.toFixed(3)}</PlayerStat>
                <PlayerStat long>{player.minutesPlayed}</PlayerStat>
                <PlayerStat>{player.pim}</PlayerStat>
              </TeamRosterTableRow>
            )
        )}
      </TeamTableContainer>
    </TeamsPreview>
  );
};

const TeamsPreview = styled.div`
  display: flex;
  flex-direction: Column;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey100};
  margin: 5px 0;
`;

const TeamName = styled.h5`
  font-size: 1.2rem;
  margin: 15px;
`;

const TeamTableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const TeamRosterTableHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey200};
  padding: 0 10px;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.grey400};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey400};
  min-width: 800px;
`;

const PlayerInfoContainer = styled.div`
  border-right: 1px solid ${({ theme }) => theme.colors.grey400};
  display: flex;
  align-items: center;
  width: 140px;

  & div {
    padding: 10px 0;
    margin: 5px 10px;
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const PlayerInfoStatHeader = styled.div`
  color: ${({ theme }) => theme.colors.grey600};
  font-size: 0.8rem;
  flex: 1;
  padding: 10px 0;
  margin: 5px 10px;
`;

const PlayerStatHeader = styled.div<{ long?: boolean }>`
  color: ${({ theme }) => theme.colors.grey600};
  font-size: 0.8rem;

  text-align: center;
  ${({ long }) =>
    long
      ? `
flex: 1;
padding: 0 10px;
`
      : `flex: 1;`}
`;

const TeamRosterTableRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0 10px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey400};
  min-width: 800px;
`;

const PlayerStat = styled.div<{ long?: boolean }>`
  font-size: 0.8rem;
  ${({ long }) =>
    long
      ? `
      flex: 1;
  padding: 0 10px;
  `
      : `flex: 1;`}
  text-align: center;
  font-family: Montserrat, sans-serif;
`;

export default BoxscoreTeamRosters;
