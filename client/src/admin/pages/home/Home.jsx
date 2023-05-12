import { Paper, useTheme } from "@mui/material";
import React from "react";

import { tokens } from "../../theme";
function Home() {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);
  console.log({ colors });
  return <Paper>Home</Paper>;
}

export default Home;
