import React, { Component } from 'react';
import Roomjoinpage from './Roomjoinpage';
import Createroompage from './Createroompage';
import Room from './Room';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import RoomWrapper from './Room';


export default class Homepage extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<p>This is Home page.</p>} />
          <Route path="/join" element={<Roomjoinpage />} />
          <Route path="/create" element={<Createroompage />} />
          <Route path = "/room/:roomCode" element={<RoomWrapper />} /> 
        </Routes>
      </Router>
    );
  }
}
