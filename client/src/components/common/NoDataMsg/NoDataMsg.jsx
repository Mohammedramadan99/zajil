import { Typography, useTheme } from "@mui/material";
import React from "react";

function NoDataMsg({ msg }) {
  const theme = useTheme();
  return (
    <Typography sx={{ fontSize: "2rem",fontWeight:600, color: "#ddd4" }}> {msg} </Typography>
  );
}

export default NoDataMsg;
