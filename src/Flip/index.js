import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Digit from '../Digit';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 1.5em;
  height: 2.75em;
  font-size: 5em;
  margin: 0.125rem;
`;

const repeat = 3;

export default function Flip({ value, className, style, iter }) {
  return (
    <Wrapper className={className} style={style}>
      <Digit value={value - 1} flipped />
      {Array(repeat).fill(value).map((v, index) => iter % repeat !== index && (
        <Digit key={`v-${index}`} value={v} />
      ))}
    </Wrapper>
  );
}

Flip.propTypes = {
  value: PropTypes.number,
  iter: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};
