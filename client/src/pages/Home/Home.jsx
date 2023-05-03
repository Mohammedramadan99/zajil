import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./HomeLight.scss";
import "./HomeDark.scss";
import { useSelector } from "react-redux";
function Home() {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { light } = useSelector((state) => state.mode);
  // const { t, i18n } = useTranslation();

  // // Set the direction of the content based on the language
  // React.useEffect(() => {
  //   if (i18n.language.indexOf("ar") === 0) {
  //     document.body.dir = "rtl";
  //   } else {
  //     document.body.dir = "ltr";
  //   }
  // }, [i18n.language]);
  return (
    <div className={!light ? "home-dark-mode" : "home-light-mode"}>
      <div className="text">{t("about")}</div>
    </div>
  );
}

export default Home;
