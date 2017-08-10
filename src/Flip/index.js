import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Digit from '../Digit';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 1.5em;
  height: 2.5em;
  font-size: 5em;
`;

export default class Flip extends PureComponent {
  static propTypes = {
    value: PropTypes.number,
  }

  state = {
    step: 0,
  }

  componentWillReceiveProps({ value }) {
    if (value !== this.props.value) {
      this.setState(({ step }) => ({ step: step + 1 }));
    }
  }

  render() {
    const { step } = this.state;
    const { value } = this.props;
    const repeat = 3;
    return (
      <Wrapper>
        <Digit value={value} flipped />
        {Array(repeat).fill(value).map((v, index) => step % repeat !== index && (
          <Digit
            key={`v-${index}`}
            value={v}
          />
        ))}
      </Wrapper>
    );
  }
}
