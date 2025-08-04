import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage("es")}
        className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 
          ${
            i18n.language === "es"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
      >
        ES
      </button>
      <button
        onClick={() => changeLanguage("pt")}
        className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 
          ${
            i18n.language === "pt"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
      >
        PT
      </button>
    </div>
  );
};

export default LanguageSelector;
