import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import Homepage from './Homepage';
import Roomjoinpage from './Roomjoinpage';
import Createroompage from './Createroompage';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
            <Homepage />
            <Roomjoinpage />
            <Createroompage />
        </div>

    )
  }
}

const appDiv = document.getElementById('app');
const root = createRoot(appDiv);
root.render(<App />);
