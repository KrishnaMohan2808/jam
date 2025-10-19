import React, { Component } from 'react';
// Imports from your first image (assuming @mui/material)
import { Grid, Typography, TextField } from '@mui/material'; 

// Import from your second image (material-ui/core is older, @mui/material is newer)
// import { TextField, Button, Grid, Typography } from "@material-ui/core";
// import { Link } from "react-router-dom";


export default class Roomjoinpage extends Component {
  constructor(props) {
    super(props);
    // State from Image 2, with roomCode added from Image 3
    this.state = {
      error: "",
      roomCode: "", // Added this because it's used in value={this.state.roomCode}
    };
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
            
            // NOTE: You will still need an onChange handler here
            // to make the text field editable, like:
            // onChange={this.handleTextFieldChange}
          />
        </Grid>
        
        {/* The rest of your component (buttons) would go here */}

      </Grid>
    );
  }
}