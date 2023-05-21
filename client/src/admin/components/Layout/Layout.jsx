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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";

import {
  HomeOutlined,
  StyleOutlined,
  PeopleAltOutlined,
  ForumOutlined,
  LocationOnOutlined,
  ManageAccountsOutlined,
} from "@mui/icons-material";

import { useMemo, useState } from "react";
import { themeSettings } from "../../theme";
import Navbar from "./Navbar";
import "./Layout.scss";

const RootLayout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeitem, setActiveItem] = useState("home");
  const { mode } = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const transition = "1s ease";
  const links = [
    { icon: <HomeOutlined />, text: "home" },
    { icon: <StyleOutlined />, text: "cards" },
    { icon: <PeopleAltOutlined />, text: "clients" },
    { icon: <LocationOnOutlined />, text: "locations" },
    { icon: <ForumOutlined />, text: "messages" },
    { icon: <ManageAccountsOutlined />, text: "managers" },
  ];
  const handleClick = (item) => {
    setActiveItem(item.text);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          display={isNonMobile ? "flex" : "block"}
          width="100%"
          height="100%">
          <Box
            sx={{
              backgroundColor: theme.palette.primary[700],
              position: "absolute",
              maxWidth: "500px",
              width: "100%",
              bottom: "50px",
              left: "50%",
              transform: "translateX(-50%)",
              borderRadius: "40px",
              // border: "1px solid #fff",
            }}>
            <List
              sx={{
                display: "flex",
                position: "relative",
                justifyContent: "center",
              }}>
              {links?.map((item) => (
                <ListItem
                  onClick={() => handleClick(item)}
                  className={activeitem === item.text ? "active" : ""}
                  sx={{
                    position: "relative",
                    flexDirection: "column",
                    maxWidth: "80px",
                    width: "100%",
                    height: "70px",
                    // backgroundColor: "#fff",
                    transition: transition,
                    "&.active .MuiListItemIcon-root": {
                      transform: "translateY(-35px)",
                    },
                    "&.active .MuiListItemIcon-root svg path,&.active .MuiListItemIcon-root svg circle":
                      {
                        color: theme.palette.primary[900],
                      },
                    "&.active .MuiButtonBase-root": {
                      transform: "translateY(20px)",
                      opacity: 1,
                      scale: "1",
                    },
                    "&:nth-child(1).active ~ .indicator": {
                      transform: "translateX(calc(80px * 0))",
                    },
                    "&:nth-child(2).active ~ .indicator": {
                      transform: "translateX(calc(80px * 1))",
                    },
                    "&:nth-child(3).active ~ .indicator": {
                      transform: "translateX(calc(80px * 2))",
                    },
                    "&:nth-child(4).active ~ .indicator": {
                      transform: "translateX(calc(80px * 3))",
                    },
                    "&:nth-child(5).active ~ .indicator": {
                      transform: "translateX(calc(80px * 4))",
                    },
                    "&:nth-child(6).active ~ .indicator": {
                      transform: "translateX(calc(80px * 5))",
                    },
                    zIndex: "999",
                  }}>
                  <ListItemIcon
                    sx={{
                      height: "75px",
                      transition: transition,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "& svg": {
                        color: theme.palette.background.alt,
                        fontSize: "25px",
                      },
                    }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemButton
                    sx={{
                      color: theme.palette.primary[100],
                      transition: transition,
                      position: "absolute",
                      transform: "translateX:40px",
                      opacity: 0,
                      scale: ".1",
                      textTransform: "capitalize",
                      fontWeight: "600",
                      "&:hover": {
                        background: "transparent",
                      },
                    }}>
                    {item.text}
                  </ListItemButton>
                </ListItem>
              ))}
              <div
                className="indicator"
                style={{
                  backgroundColor: theme.palette.primary[100],
                  borderColor: theme.palette.background.default,
                }}>
                <span
                  style={{
                    position: "absolute",
                    content: '""',
                    top: "50%",
                    left: " -22px",
                    width: " 20px",
                    height: " 20px",
                    backgroundColor: " transparent",
                    borderTopRightRadius: " 20px",
                    boxShadow: `0 -10px 0 0 ${theme.palette.background.default}`,
                  }}></span>
                <span
                  style={{
                    position: "absolute",
                    content: '""',
                    top: " 50%",
                    right: " -22px",
                    width: " 20px",
                    height: " 20px",
                    backgroundColor: " transparent",
                    borderTopLeftRadius: " 20px",
                    boxShadow: `0 -10px 0 0 ${theme.palette.background.default}`,
                  }}></span>
              </div>
            </List>
          </Box>
        </Box>
        <Box flexGrow={1}>
          <Navbar />
          <Outlet />
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default RootLayout;
