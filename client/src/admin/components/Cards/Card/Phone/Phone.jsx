import { useTheme } from "@emotion/react";
import { Box, Stack } from "@mui/material";
import React from "react";

function Phone({ children }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        border: `7px solid #ccc`,
        outline: `3px solid #ddd`,
        // border: `7px solid ${theme.palette.grey[900]}`,
        // outline: `3px solid ${theme.palette.grey[600]}`,
        width: "100%",
        height: "500px",
        borderRadius: "20px",
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
            background: "#777",
            borderRadius: "50%",
          }}></Box>
        <Box
          sx={{
            width: "70px",
            height: "10px",
            background: "#777",
            borderRadius: "10px",
          }}></Box>
      </Stack>
      {children}
    </Box>
  );
}

export default Phone;
