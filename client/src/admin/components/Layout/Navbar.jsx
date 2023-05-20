import { Box, IconButton, useTheme } from "@mui/material";
import React from "react";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useDispatch } from "react-redux";
import { setMode } from "../../../store/modeSlice";
function Navbar() {
  const theme = useTheme();
  const dispatch = useDispatch();
  return (
    <Box>
      <IconButton onClick={() => dispatch(setMode())}>
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
