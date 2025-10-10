import React, { Component } from 'react';
import Roomjoinpage from './Roomjoinpage';
import Createroompage from './Createroompage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

export default class Homepage extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<p>This is Home page.</p>} />
          <Route path="/join" element={<Roomjoinpage />} />
          <Route path="/create" element={<Createroompage />} />
        </Routes>
      </Router>
    );
  }
}
