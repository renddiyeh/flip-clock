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
    const date = format(new Date(), 'HHmmss');
    return (
      <Clock>
        {map(date, (d, index) => (
          <Flip key={`clock-${index}`} value={+d} style={!(index % 2) ? { marginLeft: '0.5em' } : null} />
        ))}
      </Clock>
    );
  }
}
