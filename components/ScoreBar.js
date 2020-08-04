import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

import ScoreBarItem from './ScoreBarItem';

function ScoreBar({ data, league }) {
  const [selected, onSelect] = useState('item4');

  return (
    <Container>
      <ScrollMenu
        data={data.map(({ type, gameid, ...stats }) => (
          <ScoreBarItem
            isDate={type === 'date'}
            key={gameid}
            data={{ ...stats }}
            league={league}
            gameid={gameid}
          />
        ))}
        translate={-189 * (data.length / 4)}
        wheel={false}
        arrowLeft={
          <Arrow>
            <BsChevronLeft size="2rem" />
          </Arrow>
        }
        arrowRight={
          <Arrow right>
            <BsChevronRight size="2rem" />
          </Arrow>
        }
        selected={selected}
        onSelect={onSelect}
        menuStyle={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none',
        }}
        alignCenter={false}
      />
    </Container>
  );
}

ScoreBar.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  league: PropTypes.string.isRequired,
};

const Container = styled.div`
  width: 100%;
  height: 93px;
  background-color: ${({ theme }) => theme.colors.grey100};

  & .scroll-menu-arrow,
  & .menu-wrapper,
  & .menu-wrapper--inner,
  & .menu-item-wrapper {
    height: 100%;
  }

  & .scroll-menu-arrow--disabled {
    visibility: hidden;
  }
`;

const Arrow = styled.div`
  position: relative;
  width: 45px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ right }) => (right ? `-` : ``)}2px 0 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 2;

  & > * {
    color: ${({ theme }) => theme.colors.grey900};
  }
`;

export default ScoreBar;
