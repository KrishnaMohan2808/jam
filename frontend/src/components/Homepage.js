import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

// Import the WRAPPERS
import RoomjoinpageWrapper from './RoomjoinpageWrapper';
import CreateroompageWrapper from './CreateroompageWrapper';
import RoomWrapper from './Room'; // <-- THIS IS THE CORRECTED LINE


export default class Homepage extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<p>This is Home page.</p>} />

          {/* Use the WRAPPERS in the element prop */}
          <Route path="/join" element={<RoomjoinpageWrapper />} />
          <Route path="/create" element={<CreateroompageWrapper />} />
          <Route path = "/room/:roomCode" element={<RoomWrapper />} /> 
          
        </Routes>
      </Router>
    );
  }
}