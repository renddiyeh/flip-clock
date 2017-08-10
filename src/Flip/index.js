import React, { PureComponent, PropTypes } from 'react';
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

export default class Flip extends PureComponent {
  static propTypes = {
    value: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
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
    const { value, className, style } = this.props;
    const repeat = 3;
    return (
      <Wrapper className={className} style={style}>
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
