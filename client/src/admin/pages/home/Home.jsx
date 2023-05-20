import { Paper, useTheme } from "@mui/material";
import React from "react";

function Home() {
  const theme = useTheme();

  // const colors = tokens(theme.palette.mode);
  // console.log({ colors });
  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.primary[900],
      }}>
      Home
    </Paper>
  );
}

export default Home;
