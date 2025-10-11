import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
// Correct imports for MUI v5
import { Button, Grid, Typography, TextField, FormHelperText, FormControl } from '@mui/material';


export default class Createroompage extends Component {
  defaultVotesToSkip = 2;
  defaultCanPause = true;
  constructor(props) {
    super(props);
  }

  render() {
    return <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          Create a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup row defaultValue="true">
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
            defaultValue={this.defaultVotesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" }
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required to Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="primary" variant="contained">
          Create A Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>;
  }
}