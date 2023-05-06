import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./NavbarLight.scss";
import LanguageSelector from "./LanguageSelector";
import { useDispatch, useSelector } from "react-redux";
import { changeMode } from "../../store/modeSlice";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
function Navbar() {
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const { t } = useTranslation();
  const { light } = useSelector((state) => state.mode);

  const isActive = () => {
    window.scrollY > 100 ? setActive(true) : setActive(false);
  };
  const changeModeHandler = () => {
    dispatch(changeMode());
  };
  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);
  return (
    <div
      className={`${!light ? "dark" : ""} ${
        active ? "navbar active" : "navbar"
      } `}
    >
      <div className="container">
        <div className="logo">loyalty.</div>
        <div className="block">
          <ul className="links">
            <li className="link">
              <Link to="/">{t("navbar.links.home")}</Link>
            </li>
            <li className="link">
              <Link to="/">{t("navbar.links.login")}</Link>
            </li>
            <li className="link">
              <Link to="/">{t("navbar.links.about")}</Link>
            </li>
          </ul>
          <LanguageSelector />

          {light ? (
            <DarkModeIcon onClick={changeModeHandler} />
          ) : (
            <LightModeIcon onClick={changeModeHandler} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
