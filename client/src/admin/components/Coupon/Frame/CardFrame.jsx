import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
function CardFrame() {
  return (
      <Box>
          {/* ============ Start Row 1 ============*/}
          <Grid container>
              <Grid item>
                  logo
              </Grid>
              <Grid item>
                  discound 50%
              </Grid>
          </Grid>
          {/* ============ End Row 1 ============*/}
          {/* ============ Start Row 2 ============*/}
          <Grid container>
              <Box>
                  <Typography> Aid Mubark </Typography>
              </Box>
          </Grid>
          {/* ============ End Row 2 ============*/}
          {/* ============ Start Row 3 ============*/}
          <Grid container>
              <Grid item>
                  <Typography> Available uses </Typography>
                  <span>3</span>
              </Grid>
              <Grid item>
                  <Typography> Available uses </Typography>
                  <span>3</span>
              </Grid>
              <Grid item>
                  <Typography> Available uses </Typography>
                  <span>3</span>
              </Grid>
          </Grid>
          {/* ============ End Row 3 ============*/}
          
    </Box>
  );
}

export default CardFrame;
