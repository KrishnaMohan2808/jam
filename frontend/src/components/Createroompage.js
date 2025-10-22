import React, { Component } from 'react';
// Import useNavigate to pass it down
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
  Alert
} from '@mui/material';
import { Alert as MuiAlert } from '@mui/material';

class Createroompage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: this.props.guestCanPause,
      votesToSkip: this.props.votesToSkip,
      errorMsg: "", 
      successMsg: ""
    };

    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
  }

  handleVotesChange(e) {
    this.setState({
      votesToSkip: parseInt(e.target.value) || 1,
    });
  }

  handleGuestCanPauseChange(e) {
    this.setState({
      guestCanPause: e.target.value === "true",
    });
  }

  handleRoomButtonPressed() {
    // If this.props.update is true, call the update API
    if (this.props.update) {
      const requestOptions = {
        method: "PATCH", // Use PATCH for updates as in your views.py
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          votes_to_skip: this.state.votesToSkip,
          guest_can_pause: this.state.guestCanPause,
          code: this.props.roomCode // Send the room code to update
        }),
      };

      fetch("/api/update-room/", requestOptions)
        .then((response) => {
          if (response.ok) {
            this.setState({ 
              successMsg: "Room updated successfully!",
              errorMsg: "" 
            });
            setTimeout(() => {
              this.props.updateCallback();
            }, 2000); 
          } else {
            this.setState({ 
              errorMsg: "Error updating room...",
              successMsg: ""
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.setState({ errorMsg: "Network error.", successMsg: "" });
        });
    } 
    // Otherwise, call the create API
    else {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          votes_to_skip: this.state.votesToSkip,
          guest_can_pause: this.state.guestCanPause,
        }),
      };

      fetch("/api/create-room/", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          // show success briefly, then navigate
          this.setState({ successMsg: "Room created!", errorMsg: "" });
          setTimeout(() => {
            this.props.navigate("/room/" + data.code);
          }, 800);
        })
        .catch((err) => {
          console.error(err);
          this.setState({ errorMsg: "Network error.", successMsg: "" });
        });
    }
  }
   
  render() {
    const title = this.props.update ? "Update Room" : "Create A Room";
    
    return (
      <Grid container spacing={1} >
        <Grid item xs={12} align="center">
          {/* This Collapse section will now work correctly */}
          <Collapse in={!!this.state.errorMsg || !!this.state.successMsg}>
            {this.state.successMsg && (
              <Alert severity="success" onClose={() => this.setState({ successMsg: "" })}>{this.state.successMsg}</Alert>
            )}  
            {this.state.errorMsg && (
              <Alert severity="error" onClose={() => this.setState({ errorMsg: "" })}>{this.state.errorMsg}</Alert> 
            )}
          </Collapse> 
          <Typography component="h4" variant="h4">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              Guest Control of Playback State
            </FormHelperText>
            <RadioGroup
              row
              value={this.state.guestCanPause.toString()} 
              onChange={this.handleGuestCanPauseChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="No Control"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="number"
              onChange={this.handleVotesChange}
              value={this.state.votesToSkip} 
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              Votes Required To Skip Song
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleRoomButtonPressed} 
          >
            {this.props.update ? "Update Room" : "Create A Room"}
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }
}

// Wrapper component is still needed to inject 'navigate' prop
export default function CreateRoomPageWrapper(props) {
  const navigate = useNavigate();
  return (
    <Createroompage {...props} navigate={navigate} />
  );
}