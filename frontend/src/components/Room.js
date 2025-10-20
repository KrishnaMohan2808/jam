import React, { Component } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
import { Typography, Grid, Button } from "@mui/material";

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
    };
    this.roomCode = props.roomCode;
    // Bind the new leave button method
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.getRoomDetails(); // Call in constructor or mount
  }

  // componentDidMount() {
  //   this.getRoomDetails();
  // }

  getRoomDetails() {
    // Added trailing slash and error handling
    fetch("/api/get-room/" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          // If room not found, redirect to homepage
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

  // New method for the "Leave Room" button
  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room/", requestOptions).then((_response) => {
      // Navigate back to the homepage
      this.props.navigate("/");
    });
  }

  // This is the corrected render method
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

// Wrapper to inject useParams AND useNavigate into the class component
export default function RoomWrapper() {
  const { roomCode } = useParams();
  const navigate = useNavigate(); // Get the navigate function
  return <Room roomCode={roomCode} navigate={navigate} />; // Pass it as a prop
}