import { useTheme } from "@emotion/react";
import { Box, Container, Grid } from "@mui/material";
import React from "react";

function CreateBranch() {
  const theme = useTheme();
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        height: "100vh",
      }}>
      <Container>
        <Grid container spacing={2}></Grid>
      </Container>
    </Box>
  );
}

export default CreateBranch;
