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
  ViewCarousel,
  Business,
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
    { icon: <HomeOutlined />, text: "home", slug: "/admin" },
    { icon: <Business />, text: "business", slug: "business/new" },
    { icon: <StyleOutlined />, text: "templates", slug: "templates" },
    { icon: <ViewCarousel />, text: "cards", slug: "cards" },
    // { icon: <PeopleAltOutlined />, text: "clients" },
    { icon: <LocationOnOutlined />, text: "location", slug: "location" },
    { icon: <ForumOutlined />, text: "messages" },
  ];
  console.log({ activeitem });
  return (
    <div className={`main_sidebar items-center ${isSidebarOpen && "active"}`}>
      <div className="logo">LOGO</div>
      {/* <div
        className="burger flex"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <Menu />
      </div> */}
      <div className="links">
        {links.map((item) => (
          <div
            className={`link ${activeitem === item.text && "active"}`}
            onClick={() => setActiveItem(item.text)}>
            <Link to={`${item.slug}`}>
              {/* <div className={`icon flex `}> {item.icon} </div> */}
              <div className="text"> {item.text} </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MobileSidebar;
