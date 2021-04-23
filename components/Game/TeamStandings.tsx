import React from 'react';
import styled from 'styled-components';
import { Standings } from '../../pages/api/v1/standings';
import { SectionTitle, TeamLogoSmall } from './common';

interface Props {
  standings: Array<Standings[number]>;
  Sprites: {
    [index: string]: React.ComponentClass<any>;
  };
}

const TeamStandings = ({ standings, Sprites }: Props): JSX.Element => {
  const isSameDivision = standings[0].name === standings[1].name;
  const sortedStandings = [
    {
      name: standings[0].name,
      teams: standings[0].teams.sort((a, b) =>
        a.position > b.position ? 1 : -1
      ),
    },
  ];
  if (!isSameDivision) {
    sortedStandings.push({
      name: standings[1].name,
      teams: standings[1].teams.sort((a, b) =>
        a.position > b.position ? 1 : -1
      ),
    });
  }

  return (
    <>
      {sortedStandings.map((TeamStandings) => (
        <TeamStandingsContainer key={TeamStandings.name}>
          <StandingsTableRow>
            <SectionTitle>{`${TeamStandings.name} Standings`}</SectionTitle>
          </StandingsTableRow>
          <StandingsTable>
            <StandingsTableHeader>
              <StandingsTableCell></StandingsTableCell>
              <StandingsTableCell>PTS</StandingsTableCell>
              <StandingsTableCell>GP</StandingsTableCell>
              <StandingsTableCell>W</StandingsTableCell>
              <StandingsTableCell>L</StandingsTableCell>
              <StandingsTableCell>OT</StandingsTableCell>
            </StandingsTableHeader>
            {TeamStandings.teams.map((team) => {
              const Logo = Sprites[team.abbreviation];
              return (
                <StandingsTableRow key={team.abbreviation}>
                  <StandingsTableCell>
                    <TeamInfo>
                      <TeamLogoSmall>
                        <Logo />
                      </TeamLogoSmall>
                      {team.abbreviation}
                    </TeamInfo>
                  </StandingsTableCell>
                  <StandingsTableCell>{team.points}</StandingsTableCell>
                  <StandingsTableCell>{team.gp}</StandingsTableCell>
                  <StandingsTableCell>{team.wins}</StandingsTableCell>
                  <StandingsTableCell>{team.losses}</StandingsTableCell>
                  <StandingsTableCell>{team.OTL}</StandingsTableCell>
                </StandingsTableRow>
              );
            })}
          </StandingsTable>
        </TeamStandingsContainer>
      ))}
    </>
  );
};

const TeamStandingsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 15px 15px 0 15px;
  width: 100%;
`;

const StandingsTable = styled.div`
  display: table;
  width: calc(100% + 30px);
  margin: 15px 0 0 -15px;
`;

const StandingsTableRow = styled.div`
  display: table-row;
  width: 100%;
`;

const StandingsTableCell = styled.div`
  display: table-cell;
  width: 30px;
  height: 40px;
  padding: 5px 0;
  font-family: Montserrat, sans-serif;
  vertical-align: middle;
  text-align: center;
  border-bottom: 2px solid ${({ theme }) => theme.colors.grey300};
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
  font-weight: 600;

  div:first-child {
    margin-right: 5px;
  }
`;

const StandingsTableHeader = styled(StandingsTableRow)`
  background-color: ${({ theme }) => theme.colors.grey300};
  width: calc(100% + 30px);
  left: -15px;
  font-weight: 600;
  height: 40px;
`;

export default React.memo(TeamStandings);
