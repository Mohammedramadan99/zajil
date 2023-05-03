import React from "react";
import { useTranslation } from "react-i18next";

function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (event) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
  ];

  return (
    <div>
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
  );
}

export default LanguageSelector;
