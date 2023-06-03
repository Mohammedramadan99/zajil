import React, { useMemo, useState } from "react";
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
} from "@mui/icons-material";
import { themeSettings } from "../../theme";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function MainSidebar() {
  const { mode } = useSelector((state) => state.mode);
  const [activeitem, setActiveItem] = useState("home");
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const navigate = useNavigate();
  const transition = "1s ease";
  const links = [
    { icon: <HomeOutlined />, text: "home" },
    { icon: <StyleOutlined />, text: "cards" },
    { icon: <PeopleAltOutlined />, text: "clients" },
    { icon: <LocationOnOutlined />, text: "location" },
    { icon: <ForumOutlined />, text: "messages" },
    { icon: <ManageAccountsOutlined />, text: "managers" },
  ];
  const handleClick = (item) => {
    setActiveItem(item.text);
    navigate(`${item.text}`);
  };
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary[900],
        position: "absolute",
        maxWidth: "500px",
        width: "100%",
        bottom: "50px",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "40px",
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
            backgroundColor: theme.palette.primary[100],
            borderColor: theme.palette.background.alt,
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
              boxShadow: `0 -10px 0 0 ${theme.palette.background.alt}`,
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
              boxShadow: `0 -10px 0 0 ${theme.palette.background.alt}`,
            }}></span>
        </div>
      </List>
    </Box>
  );
}

export default MainSidebar;
