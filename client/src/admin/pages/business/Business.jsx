import { Box, Container, Grid, useTheme } from "@mui/material";
import React from "react";
import BusinessSide from "../../components/Business/BusinessSide/BusinessSide";
import BranchSide from "../../components/Business/BranchSide/BranchSide";

function Business() {
  const theme = useTheme();
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        height: "100vh",
      }}>
      <Container>
        <Grid container spacing={2}>
          <Grid xs={6} item>
            <BusinessSide />
          </Grid>
          <Grid xs={6} item>
            <BranchSide />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Business;
