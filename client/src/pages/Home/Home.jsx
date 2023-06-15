import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./HomeLight.scss";
import { useSelector } from "react-redux";
import img_1 from "../../assets/images/final/banner_1.png";
import img_2 from "../../assets/images/final/banner_2.png";
import img_3 from "../../assets/images/final/banner_3.png";
import Phone from "../../admin/components/Cards/Card/Phone/Phone";

function Home() {
  const { t } = useTranslation();
  const { mode } = useSelector((state) => state.mode);

  return (
    <div className={mode === "dark" ? "home dark-mode" : "home light-mode"}>
      <div className="container">
        <Phone />
        <div className="box">
          <h1 className="text"> {t("banner.text")} </h1>
        </div>
      </div>
    </div>
  );
}

export default Home;
