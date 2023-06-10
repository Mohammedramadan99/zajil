import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../index.scss";
import {
  ThemeProvider,
  createTheme,
  Container,
  CssBaseline,
  Box,
  useMediaQuery,
  Grid,
} from "@mui/material";

import { useMemo, useState } from "react";
import { themeSettings } from "../../theme";
import Navbar from "./Navbar";
import "./Layout.scss";
import MobileSidebar from "./MobileSidebar/MobileSidebar";
import MainSidebar from "./MainSidebar";

const RootLayout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { mode } = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container>
        <Grid item xs={2}>
          {!isNonMobile ? <MobileSidebar /> : <MainSidebar />}
        </Grid>
        <Grid item ml={isNonMobile ? 0 : 15} xs={10} sm={12}>
          <Outlet />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default RootLayout;
