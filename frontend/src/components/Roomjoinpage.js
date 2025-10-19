import React, { Component } from 'react';
// Imports from your first image (assuming @mui/material)
import { Grid, Typography, TextField, Button } from '@mui/material'; 
// Import from your second image
import { Link } from "react-router-dom";


export default class Roomjoinpage extends Component {
  constructor(props) {
    super(props);
    // State from Image 2, with roomCode added from Image 3
    this.state = {
      error: "",
      roomCode: "", // Added this because it's used in value={this.state.roomCode}
    };

    // Bind the handler methods to 'this'
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
  }

  // Updates state as the user types
  handleTextFieldChange(e) {
    this.setState({
      roomCode: e.target.value,
    });
  }

  // Placeholder function for when the "Enter Room" button is clicked
  // You will replace this with your API call logic
  handleRoomButtonPressed() {
    console.log("Room code entered:", this.state.roomCode);
    // Example:
    // const requestOptions = { ... };
    // fetch("/api/join-room", requestOptions)
    //   .then((response) => ...)
  }

  render() {
    return (
      // Grid container from Image 1
      <Grid
        container
        spacing={1}
        align="center" // Using "center" as shown in your original code
      >
        {/* Typography from Image 1 & 3 */}
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            Join a Room
          </Typography>
        </Grid>
        
        {/* TextField from Image 3 */}
        <Grid item xs={12}>
          <TextField
            // This is the correct way to use the error prop (it expects a boolean)
            error={this.state.error.length > 0} 
            label="Code"
            placeholder="Enter a Room Code"
            value={this.state.roomCode}
            helperText={this.state.error}
            variant="outlined"
            
            // Added the onChange handler to make the field editable
            onChange={this.handleTextFieldChange}
          />
        </Grid>
        
        {/* Corrected Button section */}
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={this.handleRoomButtonPressed}
          >
            Enter Room
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="secondary" 
            to="/" 
            component={Link}
          >
            Back
          </Button>
        </Grid>

      </Grid>
    );
  }
}