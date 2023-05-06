import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./HomeLight.scss";
import "./HomeDark.scss";
import { useSelector } from "react-redux";
import img_1 from "../../assets/images/final/banner_1.png";
import img_2 from "../../assets/images/final/banner_2.png";
import img_3 from "../../assets/images/final/banner_3.png";
function Home() {
  const { t } = useTranslation();
  const { light } = useSelector((state) => state.mode);

  return (
    <div className={!light ? "home-dark-mode" : "home-light-mode"}>
      <div className="bgs">
        <div className="p1">
          <img src={img_1} alt="banner-img" />
        </div>
        <div className="p2">
          <img src={img_2} alt="banner-img" />
        </div>
        <div className="p3">
          <img src={img_3} alt="banner-img" />
        </div>
      </div>
    </div>
  );
}

export default Home;
