import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./HomeLight.scss";
import "./HomeDark.scss";
import { useSelector } from "react-redux";
function Home() {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { light } = useSelector((state) => state.mode);
  return (
    <div className={!light ? "home-dark-mode" : "home-light-mode"}>
      <div className="text">{t("about")}</div>
    </div>
  );
}

export default Home;
