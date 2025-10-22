import React, { Component } from "react";
// Import useNavigate and Link
import { useParams, useNavigate, Link } from "react-router-dom"; 
import { Typography, Grid, Button } from "@mui/material";
import CreateRoomPage from "./createRoomPage";

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuthenticated: false,
    };
    this.roomCode = props.roomCode;
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.getRoomDetails();
    this.showSettingsButtonPressed = this.showSettingsButtonPressed.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    
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
        if (data.is_host) {
          this.authenticateSpotify();
        }
      });
  }

 authenticateSpotify() {
    fetch("/spotify/is-authenticated/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ spotifyAuthenticated: data.status });
        if (!data.status) {
          fetch("/spotify/get-auth-url/")
            .then((response) => response.json())
            .then((data) => {
             
              window.location.replace(data.url);
            });
        }
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
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={this.showSettingsButtonPressed}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={this.showSettingsButtonPressed}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  render() {
    if (this.state.showSettings) {
      return this.renderSettings();
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes to Skip: {this.state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest Can Pause: {this.state.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {this.state.isHost.toString()}
          </Typography>
        </Grid>
        {this.state.isHost ? this.renderSettingsButton() : null}
        <Grid item xs={12} align="center">
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