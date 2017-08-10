import React, { PureComponent } from 'react';
import styled from 'styled-components';
import getSeconds from 'date-fns/get_seconds';
import getMinutes from 'date-fns/get_minutes';
import getHours from 'date-fns/get_hours';

import Flip from './Flip';

const Clock = styled.div`
  padding-top: 2em;
  text-align: center;
`;

export default class App extends PureComponent {
  state = {
    value: 1,
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick = () => this.setState(({ value }) => ({
    value: value + 1,
  }))

  render() {
    const now = new Date();
    return (
      <Clock>
        <Flip value={getHours(now)} />
        <Flip value={getMinutes(now)} />
        <Flip value={getSeconds(now)} />
      </Clock>
    );
  }
}
