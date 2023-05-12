import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../../index.scss";
import {
  ThemeProvider,
  createTheme,
  Switch,
  Paper,
  IconButton,
  useTheme,
  useThemeProps,
  Grid,
  Container,
} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";

import Navbar from "./Navbar";
const RootLayout = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  console.log({ theme });
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <div className="app">
          <Navbar />
          <Outlet />
          footer
          {/* <Footer /> */}
        </div>
      </Container>
    </ThemeProvider>
  );
};
export default RootLayout;
