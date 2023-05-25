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
  Menu,
} from "@mui/icons-material";

import { themeSettings } from "../../../theme";
import { useSelector } from "react-redux";
import "./MobileSidebar.scss";
import { Link } from "react-router-dom";
function MobileSidebar() {
  const { mode } = useSelector((state) => state.mode);
  const [activeitem, setActiveItem] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
  console.log({ activeitem });
  return (
    <div className={`main_sidebar items-center ${isSidebarOpen && "active"}`}>
      <div className="logo">LOGO</div>
      <div
        className="burger flex"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <Menu />
      </div>
      <div className="links">
        {links.map((item) => (
          <div
            className={`link ${activeitem === item.text && "active"}`}
            onClick={() => setActiveItem(item.text)}>
            <Link to="#">
              <div className={`icon flex `}> {item.icon} </div>
              <div className="text"> {item.text} </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MobileSidebar;
