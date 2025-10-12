import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import Homepage from './Homepage';


export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <Homepage />
        </div>
    )
  }
}

const appDiv = document.getElementById('app');
const root = createRoot(appDiv);
root.render(<App />);