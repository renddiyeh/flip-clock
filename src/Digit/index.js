import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TWEEN from '@tweenjs/tween.js';

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

const yOffset = 4;

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
  font-size: 225%;
  position: absolute;
  overflow: hidden;
  border: 2px solid black;
  border-radius: 0.75rem;
`;

const FlipFront = styled(FlipCard)`
  transform-origin: 50% 100%;
  top: 0;
  ${({ flipped }) => flipped && `
    transform: rotateX(180deg) translateY(-${yOffset}px);
  `}
`;

const FlipBack = styled(FlipCard)`
  transform-origin: 50% 0%;
  transform: rotateX(-180deg);
  bottom: 0;
  ${({ flipped }) => flipped && `
    transform: rotateX(0) translateY(${yOffset}px);
    z-index: 5;
  `}
  ${({ zFlipped }) => zFlipped && `
    z-index: 5;
  `}
`;

const DigitCard = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const DigitUpper = styled(DigitCard)`
  top: 100%;
`;

const DigitLower = styled(DigitCard)`
  top: 0;
`;

const flipDuration = 500;

export default class Digit extends PureComponent {
  static propTypes = {
    flipped: PropTypes.bool,
    value: PropTypes.number,
  }

  state = {
    value: this.props.value,
    zFlipped: false,
    completed: false,
  }

  componentDidMount() {
    const tween = new TWEEN.Tween({ rotate: 0, y: 0 });
    tween.to({ rotate: 180, y: yOffset }, flipDuration)
      .onUpdate(({ rotate, y }) => {
        setTransform(this.back, `rotateX(${-180 + rotate}deg) translateY(${y}px)`);
        setTransform(this.front, `rotateX(${rotate}deg) translateY(-${y}px)`);
      })
      .onComplete(() => {
        this.setState({ completed: true });
        cancelAnimationFrame(this.animation);
      });
    this.tween = tween;
  }

  componentWillReceiveProps({ value }) {
    const { flipped } = this.props;
    if (this.state.completed) return;
    if (value !== this.props.value) {
      if (flipped) {
        setTimeout(() => this.setState({ value }), flipDuration)
      } else {
        this.tween.start();
        this.animate();
      }
    }
  }

  animate = (timestamp) => {
    const { zFlipped } = this.state;
    this.startTime = this.startTime || timestamp;
    if ((timestamp - this.startTime) > flipDuration / 2 && !zFlipped) {
      this.setState({ zFlipped: true });
    }
    this.animation = requestAnimationFrame(this.animate);
    TWEEN.update();
  }

  render() {
    const { flipped } = this.props;
    const { value, zFlipped } = this.state;
    return (
      <Wrapper style={{ zIndex: flipped ? 1 : 10 - value }}>
        <FlipBack innerRef={(ref) => (this.back = ref)} zFlipped={zFlipped} flipped={flipped}>
          <DigitLower>{value === 9 ? 0 : value + 1}</DigitLower>
        </FlipBack>
        <FlipFront innerRef={(ref) => (this.front = ref)} zFlipped={zFlipped} flipped={flipped}>
          <DigitUpper>{value < 0 ? 9 : value}</DigitUpper>
        </FlipFront>
      </Wrapper>
    );
  }
}
