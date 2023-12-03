import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../index.scss";
import {
  ThemeProvider,
  createTheme,
  Container,
  CssBaseline,
  Box,
  useMediaQuery,
  Grid,
  Typography,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";
import { themeSettings } from "../../theme";
import "./Layout.scss";
import MobileSidebar from "./MobileSidebar/MobileSidebar";
import MainSidebar from "./MainSidebar";
import UserInfo from "../../components/UserInfo/UserInfo";
import { profileAction } from "../../../store/authSlice";
const RootLayout = () => {
  const dispatch = useDispatch()
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { mode } = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const { user } = useSelector((state) => state.auth);
  const isSmallScreen = useMediaQuery(theme.breakpoints.between("0", "600"));
  useEffect(() => {
    dispatch(profileAction())
  }, [])
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid item>{!isNonMobile ? <MobileSidebar /> : <MainSidebar />}</Grid>
      <Grid container>
        <Box
          position={"fixed"}
          top={isSmallScreen ? 40 : 20}
          right={30}
          zIndex={9999}>
          <div className="user">
            <UserInfo />
            <Typography
              textTransform={"capitalize"}
              fontSize={10}
              fontWeight={600}>
              {" "}
              {user.firstName}
            </Typography>
          </div>
        </Box>

        <Grid
          item
          width="100%"
          // minHeight={"100%"}
        >
          <Outlet />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default RootLayout;
