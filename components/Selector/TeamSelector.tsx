import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  ButtonContent,
  DropdownButton,
  DropdownItem,
  DropdownList,
  Caret,
} from './styles';
import { Team } from '../..';

export interface MinimalTeam {
  id: string;
  name: string;
}

interface Props {
  teams: Team[];
  onChange: (team: MinimalTeam) => void;
}

const defaultOption = {
  id: '-1',
  name: 'All Teams',
};

function TeamSelector({ teams, onChange }: Props): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTeam, setselectedTeam] = useState<MinimalTeam>(defaultOption);
  const selectorRef = useRef(null);
  const onMouseLeave = () => {
    setIsExpanded(false);
    if (selectorRef.current) {
      selectorRef.current.removeEventListener('mouseleave', onMouseLeave);
    }
  };

  useEffect(() => {
    if (isExpanded && selectorRef.current) {
      selectorRef.current.addEventListener('mouseleave', onMouseLeave);
    }
  }, [selectorRef, isExpanded]);

  const onButtonClick = () => setIsExpanded(!isExpanded);
  const onTeamSelect = (event) => {
    const { team } = event.target.dataset;
    const parsedTeam = JSON.parse(team);
    onChange(parsedTeam);
    setselectedTeam(parsedTeam);
    setIsExpanded(false);
  };

  return (
    <Container ref={selectorRef}>
      <DropdownButton onClick={onButtonClick} inverse>
        <ButtonContent>
          {selectedTeam.name}
          <FarCaret className={isExpanded ? 'up' : 'down'} inverse />
        </ButtonContent>
      </DropdownButton>
      {isExpanded && (
        <DropdownList>
          <DropdownItem
            key="all"
            align="left"
            data-team={JSON.stringify(defaultOption)}
            onClick={onTeamSelect}
            className={selectedTeam.id === defaultOption.id && 'active'}
          >
            {defaultOption.name}
          </DropdownItem>
          {teams
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((team) => {
              const teamData: MinimalTeam = {
                id: `${team.id}`,
                name: team.name,
              };
              return (
                <DropdownItem
                  key={team.id}
                  align="left"
                  data-team={JSON.stringify(teamData)}
                  onClick={onTeamSelect}
                  className={selectedTeam.id === teamData.id && 'active'}
                >
                  {team.name}
                </DropdownItem>
              );
            })}
        </DropdownList>
      )}
    </Container>
  );
}

const FarCaret = styled(Caret)`
  margin-left: auto;
`;

export default React.memo(TeamSelector);
