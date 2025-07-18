import React, { useMemo } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  createTheme,
} from "@mui/material";
import {
  HomeOutlined,
  StyleOutlined,
  PeopleAltOutlined,
  ForumOutlined,
  LocationOnOutlined,
  ManageAccountsOutlined,
  Business,
  ViewCarousel,
} from "@mui/icons-material";
import { themeSettings } from "../../theme";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link, redirect } from "react-router-dom";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

function MainSidebar() {
  const { mode } = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const navigate = useNavigate();
  const location = useLocation();
  const transition = "1s ease";
  // const links = [
  //   { icon: <HomeOutlined />, text: "home", slug: "/dashboard" },
  //   { icon: <Business />, text: "business", slug: "/business/new" },
  //   { icon: <StyleOutlined />, text: "templates", slug: "/templates" },
  //   { icon: <ViewCarousel />, text: "cards", slug: "/cards" },
  //   // { icon: <PeopleAltOutlined />, text: "clients" },
  //   { icon: <LocationOnOutlined />, text: "location", slug: "/location" },
  //   { icon: <ForumOutlined />, text: "messages", slug: "/messages" },
  // ];
  const links = [
    { icon: <HomeOutlined />, text: "home", path: "", slug: "dashboard" },
    {
      icon: <BusinessCenterIcon />,
      text: "business",
      path: "/dashboard/business/new",
      slug: "business/new",
    },
    {
      icon: <Business />,
      text: "branch",
      path: "/dashboard/branch/new",
      slug: "branch/new",
    },

    {
      icon: <StyleOutlined />,
      text: "templates",
      path: "/dashboard/templates",
      slug: "templates",
    },
    {
      icon: <ViewCarousel />,
      text: "cards",
      path: "/dashboard/cards",
      slug: "cards",
    },
    {
      icon: <LocationOnOutlined />,
      text: "location",
      // path: "/dashboard/location",
      path: "#",
      slug: "location",
    },
  ];
  const activeItem =
    links.find((item) => item.path == location.pathname.slice(0)) ||
    (links[0].slug == location.pathname.slice(1) && links[0]);

  const handleClick = (item) => {
    navigate(item.path);
  };
  return (
    <Box
      sx={{
        backgroundColor: `#0002`,
        backdropFilter: "blur(10px)",
        position: "fixed",
        maxWidth: "500px",
        width: "100%",
        bottom: "50px",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "40px",
        zIndex: 10,
      }}>
      <List
        sx={{
          display: "flex",
          position: "relative",
          justifyContent: "center",
        }}>
        {links.map((item, i) => (
          <ListItem
            key={item.text}
            onClick={() => handleClick(item)}
            className={activeItem?.text === item.text ? "active" : ""}
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
                  color: theme.palette.primary[500],
                },
              "&.active .MuiButtonBase-root": {
                transform: "translateY(20px)",
                opacity: 1,
                scale: "1",
                color: theme.palette.primary[500],
              },
              "&:nth-of-type(1).active ~ .indicator": {
                transform: "translateX(calc(80px * 0))",
              },
              "&:nth-of-type(2).active ~ .indicator": {
                transform: "translateX(calc(80px * 1))",
              },
              "&:nth-of-type(3).active ~ .indicator": {
                transform: "translateX(calc(80px * 2))",
              },
              "&:nth-of-type(4).active ~ .indicator": {
                transform: "translateX(calc(80px * 3))",
              },
              "&:nth-of-type(5).active ~ .indicator": {
                transform: "translateX(calc(80px * 4))",
              },
              "&:nth-of-type(6).active ~ .indicator": {
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
                  color: theme.palette.grey[600],
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
            backgroundColor: activeItem ? "#0003" : "transparent",
            borderColor: "transparent",
            backdropFilter: activeItem ? "blur(10px)" : "",
          }}>
          <span
            style={{
              position: "absolute",
              content: '""',
              top: "50%",
              left: " -22px",
              width: " 20px",
              height: " 20px",
              backgroundColor: "transparent",
              borderTopRightRadius: " 20px",
              boxShadow: `0 -10px 0 0 #0001`,
              backdropFilter: activeItem ? "blur(10px)" : "",
            }}></span>
          <span
            style={{
              position: "absolute",
              content: '""',
              top: " 50%",
              right: " -22px",
              width: " 20px",
              height: " 20px",
              backgroundColor: "transparent",
              borderTopLeftRadius: "20px",
              boxShadow: `0 -10px 0 0 transparent`,
              backdropFilter: activeItem ? "blur(10px)" : "",
            }}></span>
        </div>
      </List>
    </Box>
  );
}

export default MainSidebar;
