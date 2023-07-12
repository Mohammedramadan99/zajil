import React, { useMemo, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
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
  Menu,
} from "@mui/icons-material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

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
    { icon: <HomeOutlined />, text: "home", path: "admin", slug: "" },
    {
      icon: <BusinessCenterIcon />,
      text: "business",
      path: "admin/business/new",
      slug: "business/new",
    },
    {
      icon: <Business />,
      text: "branch",
      path: "admin/branch/new",
      slug: "branch/new",
    },

    {
      icon: <StyleOutlined />,
      text: "templates",
      path: "admin/templates",
      slug: "templates",
    },
    {
      icon: <ViewCarousel />,
      text: "cards",
      path: "admin/cards",
      slug: "cards",
    },
    {
      icon: <LocationOnOutlined />,
      text: "location",
      path: "admin/location",
      slug: "location",
    },
  ];
  console.log({ activeitem });
  return (
    <div
      className={`main_sidebar items-center ${isSidebarOpen ? "show" : ""}`}>
      <Stack>
        <div className="logo">LOGO</div>
        <div
          className="burger flex"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu />
        </div>
      </Stack>

      <Stack className="links">
        {links.map((item, i) => (
          <div
            key={i}
            className={`link ${activeitem === item.text ? "active" : ""}`}
            onClick={() => setActiveItem(item.text)}>
            <Link to={`${item.slug}`}>
              {/* <div className={`icon flex `}> {item.icon} </div> */}
              <div className="text"> {item.text} </div>
            </Link>
          </div>
        ))}
      </Stack>
    </div>
  );
}

export default MobileSidebar;
