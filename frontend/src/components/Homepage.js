import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate // 1. Import Navigate
} from "react-router-dom";
// Corrected: Imports must be capitalized
import { Typography, Button, Grid } from '@mui/material';

// Import the WRAPPERS
import RoomjoinpageWrapper from './RoomjoinpageWrapper';
import CreateroompageWrapper from './CreateroompageWrapper';
import RoomWrapper from './Room'; // <-- THIS IS THE CORRECTED LINE


export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
    this.clearroomCode = this.clearroomCode.bind(this);
  }

  // Removed 'async' since we are using .then()
  componentDidMount() {
    fetch('/api/user-in-room/') // Make sure this URL has a trailing slash if Django needs it!
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code,
        });
      });
  }
  
  // This function must return valid JSX
  renderHomepage() { 
    return (
      <Grid
        container
        spacing={3}
        align="center"
        style={{ marginTop: '2rem' }} // Added some margin for spacing
      >
        <Grid item xs={12}>
          <Typography variant="h3" component="h3">
            Welcome to Music Jam
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          {/* Use component={Link} prop on the Button */}
          <Button 
            variant="contained" 
            color="primary" 
            to="/join" 
            component={Link}
          >
            Join a Room
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="secondary" 
            to="/create" 
            component={Link}
          >
            Create a Room
          </Button>
        </Grid>
      </Grid>
    );        
  }
  clearroomCode() {
    this.setState({
      roomCode: null,
    });
  } 

  render() {
    return (
      <Router>
        <Routes>
          {/* 2. THIS IS THE CORRECTED ROUTE:
            It now renders the <Navigate> component if roomCode exists,
            or the homepage element if it doesn't.
          */}
          <Route 
            path="/" 
            element={
              this.state.roomCode ? (
                <Navigate replace to={`/room/${this.state.roomCode}`} />
              ) : (
                this.renderHomepage()
              )
            } 
          />

          {/* Use the WRAPPERS in the element prop */}
          <Route path="/join" element={<RoomjoinpageWrapper />} />
          <Route path="/create" element={<CreateroompageWrapper />} />
          <Route path="/room/:roomCode" element={<RoomWrapper clearRoomCallback={this.clearroomCode} />} /> 
          
        </Routes>
      </Router>
    );
  }
}