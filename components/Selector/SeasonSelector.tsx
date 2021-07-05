import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DotLoader } from 'react-spinners';

import { getLatestSeason, getQuerySeason } from '../../utils/season';

import {
  Container,
  ButtonContent,
  SeasonText,
  DropdownButton,
  DropdownItem,
  DropdownList,
  Caret,
} from './styles';

interface Props {
  seasons: number[];
  loading: boolean;
}

function SeasonSelector({ seasons, loading }: Props): JSX.Element {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('');
  const selectorRef = useRef(null);
  
  const onMouseLeave = useCallback(() => {
    setIsExpanded(false);
    if (selectorRef.current) {
      selectorRef.current.removeEventListener('mouseleave', onMouseLeave);
    }
  }, [selectorRef.current]);

  useEffect(() => {
    if (isExpanded && selectorRef.current) {
      selectorRef.current.addEventListener('mouseleave', onMouseLeave);
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
        ? window.location.search.replace(
            seasonInSearch[0],
            `${seasonInSearch[1]}season=${season}`
          )
        : `?season=${season}`;
      const newPath = `${window.location.pathname}${updatedSearch}`;
      router.push(newPath);
      setSelectedSeason(season);
      setIsExpanded(false);
    }
  };

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
      {isExpanded && (
        <DropdownList>
          {seasons
            .sort((a, b) => b - a)
            .map((season) => (
              <DropdownItem
                key={season}
                data-season={season}
                onClick={onSeasonSelect}
                className={parseInt(selectedSeason) === season && 'active'}
              >
                <SeasonText data-season={season} />
                {season}
              </DropdownItem>
            ))}
        </DropdownList>
      )}
    </Container>
  );
}

export default React.memo(SeasonSelector);
