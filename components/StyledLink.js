import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLink = ({ as, children, className, href }) => (
  <Link href={href} as={as} passHref>
    <span className={className}>{children}</span>
  </Link>
);

StyledLink.propTypes = {
  as: PropTypes.string.isRequired,
  children: PropTypes.string || PropTypes.object || PropTypes.element,
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
};

StyledLink.defaultProps = {
  children: '',
  className: '',
};

export default styled(StyledLink)`
  color: #0075e0;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #40a9ff;
  }

  &:focus {
    color: #40a9ff;
    outline: none;
    border: 0;
  }
`;
