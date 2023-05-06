import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  const handleChangeLanguage = (event) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
  ];
  useEffect(() => {
    // Add event listener to detect clicks outside of search results
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="langus" ref={searchRef}>
      <div className="icon" onClick={() => setOpen(!open)}>
        <LanguageIcon />
      </div>
      <div className={`items ${open ? "open" : ""}`}>
        {languages.map((language) => (
          <button
            key={language.code}
            value={language.code}
            onClick={handleChangeLanguage}
            disabled={i18n.language === language.code}
          >
            {language.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSelector;
