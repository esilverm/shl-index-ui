import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { DotLoader } from 'react-spinners';

import { getLatestSeason, getQuerySeason } from '../utils/season';

interface Props {
  seasons: string[];
  loading: boolean;
}

function SeasonSelector({ seasons, loading }: Props): JSX.Element {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('');
  const selectorRef = useRef(null);

  const onMouseLeave = () => {
    setIsExpanded(false);
    if (selectorRef.current) {
      selectorRef.current.removeEventListener("mouseleave", onMouseLeave);
    }
  };

  useEffect(() => {
    if (isExpanded && selectorRef.current) {
      selectorRef.current.addEventListener("mouseleave", onMouseLeave);
    }
  }, [selectorRef, isExpanded]);
  useEffect(() => {
    let nextSeason = getQuerySeason();

    if (!nextSeason && seasons) {
      nextSeason = getLatestSeason(seasons);
    }

    setSelectedSeason(nextSeason);
  }, [seasons]);

  const onButtonClick = () => setIsExpanded(!isExpanded);
  const onSeasonSelect = (event) => {
    const season = event.target.dataset.season;
    const seasonInSearch = window.location.search.match(/([?|&])season=\d+/);

    if (season && season.match(/\d+/)) {
      const updatedSearch = seasonInSearch
        ? window.location.search.replace(seasonInSearch[0], `${seasonInSearch[1]}season=${season}`)
        : `?season=${season}`;
      const newPath = `${window.location.pathname}${updatedSearch}`
      router.push(newPath);
      setSelectedSeason(season);
      setIsExpanded(false);
    }
  };

  const renderDropdownItems = () => seasons.sort((a, b) => parseInt(b) - parseInt(a)).map(season => (
    <DropdownItem
      key={season}
      data-season={season}
      onClick={onSeasonSelect}
    >
      <SeasonText data-season={season} />
      {season}
    </DropdownItem>
  ));

  return (
    <Container ref={selectorRef}>
      <DropdownButton onClick={onButtonClick}>
        <ButtonContent>
          <SeasonText />
          {selectedSeason}
          {loading && !selectedSeason && <DotLoader size={15} color="white" />}
          <Caret className={isExpanded ? 'up' : 'down'} />
        </ButtonContent>
      </DropdownButton>
      {isExpanded && <DropdownList>
        {renderDropdownItems()}
      </DropdownList>}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-weight: 700;
`;

const DropdownButton = styled.button`
  width: 100%;
  background-color: transparent;
  padding: 6px 16px;
  border: 1px solid white;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blue600};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.blue700};
  }

  @media screen and (max-width: 670px) {
    padding: 6px 8px;
  }
`;

const SeasonText = styled.span`
  &::after {
    content: 'Season';
    margin-right: 4px;
  }

  @media screen and (max-width: 670px) {
    &::after {
      content: 'S';
      margin-right: 0;
    }
  }
`;

const Caret = styled.span`
  width: 0;
  height: 0;  
  display: inline-block;
  border: 5px solid transparent;
  margin-left: 5px;

  &.down {
    border-top-color: white;
    margin-top: 5px;
  }

  &.up {
    border-bottom-color: white;
    margin-bottom: 5px;
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  max-height: 300px;
  width: 100%;
  list-style-type: none;
  background-color: ${({ theme }) => theme.colors.grey100};
  border: 1px solid ${({ theme }) => theme.colors.grey300};
  border-top: none;
  z-index: 1000;
  overflow-y: auto;
`;

const DropdownItem = styled.li`
  line-height: 1.75;
  text-align: center;
  padding: 2px 0;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grey400};
  }
`;

export default React.memo(SeasonSelector);
