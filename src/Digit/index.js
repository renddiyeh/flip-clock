import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TWEEN from '@tweenjs/tween.js';

function pad(n, width, padder = '0') {
  const number = n.toString();
  const { length } = number;
  return length >= width ? number : new Array((width - length) + 1).join(padder) + n;
}

/* eslint-disable no-param-reassign */
function setTransform(element, transfromString) {
  if (!element) return;
  element.style.webkitTransform = transfromString;
  element.style.MozTransform = transfromString;
  element.style.msTransform = transfromString;
  element.style.OTransform = transfromString;
  element.style.transform = transfromString;
}
/* eslint-enable no-param-reassign */

const Wrapper = styled.div`
  line-height: 2;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const FlipCard = styled.div`
  background: white;
  left: 0;
  width: 100%;
  height: 50%;
  position: absolute;
  overflow: hidden;
  border: 1px solid black;
`;

const FlipFront = styled(FlipCard)`
  transform-origin: 50% 100%;
  top: 0;
  ${({ flipped }) => flipped && `
    transform: rotateX(180deg);
  `}
`;

const FlipBack = styled(FlipCard)`
  transform-origin: 50% 0%;
  transform: rotateX(-180deg);
  bottom: 0;
  ${({ flipped }) => flipped && `
    transform: rotateX(0);
    z-index: 5;
  `}
  ${({ zFlipped }) => zFlipped && `
    z-index: 5;
  `}
`;

const Digit = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const DigitUpper = styled(Digit)`
  top: 100%;
`;

const DigitLower = styled(Digit)`
  top: 0;
`;

const flipDuration = 250;

export default class FlipClock extends PureComponent {
  static propTypes = {
    flipped: PropTypes.bool,
    freeeze: PropTypes.bool,
    value: PropTypes.number,
  }

  state = {
    value: this.props.value,
    zFlipped: false,
    completed: false,
  }

  componentDidMount() {
    const tween = new TWEEN.Tween({ rotate: 0 });
    tween.to({ rotate: 180 }, flipDuration)
      .onUpdate(({ rotate }) => {
        setTransform(this.back, `rotateX(${-180 + rotate}deg)`);
        setTransform(this.front, `rotateX(${rotate}deg)`);
      })
      .onComplete(() => {
        this.setState({ completed: true });
        cancelAnimationFrame(this.animation);
      });
    this.tween = tween;
  }

  componentWillReceiveProps({ value }) {
    const { flipped, freeeze } = this.props;
    if (freeeze || this.state.completed) return;
    if (value !== this.props.value) {
      if (flipped) {
        setTimeout(() => this.setState({ value }), flipDuration / 2);
      } else {
        this.tween.start();
        this.animate();
      }
    }
  }

  animate = (timestamp) => {
    const { zFlipped, value } = this.state;
    this.startTime = this.startTime || timestamp;
    if ((timestamp - this.startTime) > flipDuration / 2 && !zFlipped) {
      this.setState({ zFlipped: true, value: value + 1 });
    }
    this.animation = requestAnimationFrame(this.animate);
    TWEEN.update();
  }

  render() {
    const { flipped } = this.props;
    const { value, zFlipped } = this.state;
    return (
      <Wrapper style={{ zIndex: 60 - value }}>
        <FlipBack innerRef={(ref) => (this.back = ref)} zFlipped={zFlipped} flipped={flipped}>
          <DigitLower>{pad(value, 2)}</DigitLower>
        </FlipBack>
        <FlipFront innerRef={(ref) => (this.front = ref)} zFlipped={zFlipped} flipped={flipped}>
          <DigitUpper>{pad(value, 2)}</DigitUpper>
        </FlipFront>
      </Wrapper>
    );
  }
}
