import React, { Component } from "react";
// Import useNavigate and Link
import { useParams, useNavigate, Link } from "react-router-dom"; 
import { Typography, Grid, Button } from "@mui/material";

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
    };
    this.roomCode = props.roomCode;
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.getRoomDetails();
    this.showSettingsButtonPressed = this.showSettingsButtonPressed.bind(this);
  }

  getRoomDetails() {
    fetch("/api/get-room/" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          // If room is not found, clear the bad code and go home
          this.props.clearRoomCallback(); // Call the prop
          this.props.navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      });
  }

  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room/", requestOptions).then((_response) => {
      // 👇 CALL THE CALLBACK FUNCTION FROM THE PARENT (Homepage.js)
      this.props.clearRoomCallback(); 
      // Now navigate home
      this.props.navigate("/");
    });
  }

  showSettingsButtonPressed = () => {
    this.setState({
      showSettings: !this.state.showSettings,
    });
  };

  renderSettings() {
    return (
      <Grid container spacing={1} align="center">
        <Grid item xs={12}>
          <Typography variant="h6" component="h6">
            Settings
          </Typography>
        </Grid>
        {/* Settings form would go here */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={this.showSettingsButtonPressed}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <Grid container spacing={1} align="center" style={{ marginTop: '2rem' }}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            Votes to Skip: {this.state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            Guest Can Pause: {this.state.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            Host: {this.state.isHost.toString()}
          </Typography>
        </Grid>
        {this.state.isHost ? (
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.showSettingsButtonPressed}
            >
              Settings
            </Button>
          </Grid>
        ) : null}
        {this.state.showSettings ? this.renderSettings() : null}  
        <Grid item xs={12} style={{ marginTop: '1rem' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}

// Wrapper to inject props into the class component
export default function RoomWrapper(props) { // Accept all props
  const { roomCode } = useParams();
  const navigate = useNavigate(); 
  
  // Pass all props ({...props}) and the router props down
  return (
    <Room 
      {...props} 
      roomCode={roomCode} 
      navigate={navigate} 
    />
  );
}