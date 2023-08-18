import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Switch from "@mui/material/Switch";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import { Avatar, useTheme, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { setMode } from "../../../store/modeSlice";

// const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
//   position: "fixed",
//   "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
//     bottom: theme.spacing(2),
//     right: theme.spacing(2),
//   },
//   "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
//     top: theme.spacing(2),
//     left: theme.spacing(2),
//   },
// }));
const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  //   position: "fixed",
  //   top: theme.spacing(2),
  //   right: theme.spacing(2),
}));

export default function PlaygroundSpeedDial() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [direction, setDirection] = React.useState("left");
  const [hidden, setHidden] = React.useState(false);
  const actionshandler = (action) => {
    if (action.id === 1) {
      dispatch(logoutAction());
      navigate("/auth/login");
    }
    if (action.id === 2) {
      navigate("/admin/scan");
    }
    if (action.id === 3) {
      dispatch(setMode());
    }
  };
  const actions = [
    { id: 1, icon: <LogoutIcon />, name: "Log Out" },
    { id: 2, icon: <QrCodeScannerIcon />, name: "Scan" },
    {
      id: 3,
      icon:
        theme.palette.mode === "light" ? (
          <DarkModeOutlinedIcon />
        ) : (
          <LightModeOutlinedIcon />
        ),
      name: theme.palette.mode === "light" ? "dark" : "light",
    },
    // { id: 4, icon: , name: "Scan" },
  ];
  const { mode } = useSelector((state) => state.mode);

  return (
    <StyledSpeedDial
      ariaLabel="SpeedDial playground example"
      hidden={hidden}
      icon={<Avatar sx={{ color: theme.palette.grey[900] }}></Avatar>}
      direction={direction}
      sx={{
        ".css-1a3kk93-MuiButtonBase-root-MuiFab-root-MuiSpeedDial-fab,.css-1930fky-MuiButtonBase-root-MuiFab-root-MuiSpeedDial-fab,.css-tbbtms-MuiButtonBase-root-MuiFab-root-MuiSpeedDial-fab":
          {
            background: "transparent",
          },
        ".css-1a3kk93-MuiButtonBase-root-MuiFab-root-MuiSpeedDial-fab:hover": {
          background: "transparent",
        },
      }}>
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => actionshandler(action)}
        />
      ))}
    </StyledSpeedDial>
  );
}
