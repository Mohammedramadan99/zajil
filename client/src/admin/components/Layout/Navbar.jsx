import { Box, IconButton, useTheme } from "@mui/material";
import React, { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
function Navbar() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
    <Box>
      <IconButton onClick={colorMode.toggleColorMode}>
        {theme.palette.mode === "light" ? (
          <DarkModeOutlinedIcon />
        ) : (
          <LightModeOutlinedIcon />
        )}
      </IconButton>
    </Box>
  );
}

export default Navbar;
