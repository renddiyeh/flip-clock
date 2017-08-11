import React, { PureComponent } from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import map from 'lodash/map';

import Flip from './Flip';

const Clock = styled.div`
  padding-top: 2em;
  text-align: center;
`;

export default class App extends PureComponent {
  state = {
    iter: 0,
    pause: false,
  }

  componentDidMount() {
    this.startTimter();
    // setTimeout(() => {
    //   this.tick();
    // }, 1000);
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  handleClick = () => {
    const { pause } = this.state;
    if (pause) {
      this.startTimter();
    } else {
      this.stopTimer();
    }
    this.setState({ pause: !pause });
  }

  startTimter = () => {
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  stopTimer = () => clearInterval(this.timer)

  tick = () => this.setState(({ iter }) => ({
    iter: iter + 1,
  }))

  render() {
    const { iter, pause } = this.state;
    const date = format(new Date(), 'HHmmss');
    return (
      <div>
        <Clock>
          {map(date, (d, index) => (
            <Flip
              key={`clock-${index}`}
              value={+d}
              iter={iter}
              style={!(index % 2) ? { marginLeft: '0.5em' } : null}
            />
          ))}
        </Clock>
        <button onClick={this.handleClick}>{pause ? 'Start' : 'Pause'}</button>
      </div>
    );
  }
}
