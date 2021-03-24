import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { DotLoader } from 'react-spinners';
import {
  Container,
  ButtonContent,
  SeasonText,
  DropdownButton,
  DropdownItem,
  DropdownList,
  Caret
} from './styles';
import { getLatestSeason, getQuerySeason } from '../../utils/season';

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
      selectorRef.current.removeEventListener('mouseleave', onMouseLeave);
    }
  };

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
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((season) => (
              <DropdownItem
                key={season}
                data-season={season}
                onClick={onSeasonSelect}
                className={selectedSeason == season && "active"} // Only two equal signs as they're different types<string, number>
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
