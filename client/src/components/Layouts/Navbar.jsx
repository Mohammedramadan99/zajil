import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../../store/modeSlice";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./NavbarLight.scss";
function Navbar() {
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const { t } = useTranslation();
  const { mode } = useSelector((state) => state.mode);

  const isActive = () => {
    window.scrollY > 100 ? setActive(true) : setActive(false);
  };
  const changeModeHandler = () => {
    dispatch(setMode());
  };
  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);
  return (
    <div
      className={`navbar ${mode === "dark" ? "dark-mode" : "light-mode"} ${
        active ? "active" : ""
      } `}>
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

          {mode === "light" ? (
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
