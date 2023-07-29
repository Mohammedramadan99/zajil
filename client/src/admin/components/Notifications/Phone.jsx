import { Box, Stack, useTheme } from "@mui/material";
import React from "react";
import backgroundImg from "../../../assets/images/background.webp";
function Phone({ children }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "relative",
        border: `5px solid ${theme.palette.grey[800]}`,
        outline: `3px solid ${theme.palette.grey[900]}`,
        // border: `7px solid ${theme.palette.grey[900]}`,
        // outline: `3px solid ${theme.palette.grey[600]}`,
        width: "300px",
        minHeight: "550px",
        borderRadius: "20px",
        // background: `${theme.palette.grey[900]}`,
        background: `url(${backgroundImg}) center center`,
      }}>
      
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent={"center"}
        marginBlock={2}>
        <Box
          sx={{
            width: "10px",
            height: "10px",
            background: theme.palette.grey[700],
            borderRadius: "50%",
            zIndex:999
          }}></Box>
        <Box
          sx={{
            width: "70px",
            height: "10px",
            background: theme.palette.grey[800],
            borderRadius: "10px",
            zIndex:999
          }}></Box>
      </Stack>
      {children}
    </Box>
  );
}

export default Phone;
