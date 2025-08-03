// /src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Archivos de traducción
import translationES from "./locales/es/translation.json";
import translationPT from "./locales/pt/translation.json";

// Los recursos con las traducciones
const resources = {
  es: {
    translation: translationES,
  },
  pt: {
    translation: translationPT,
  },
};

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Pasa la instancia de i18n a react-i18next
  .init({
    resources,
    fallbackLng: "es", // Idioma por defecto si no se detecta o no está disponible el del usuario
    interpolation: {
      escapeValue: false, // React ya se encarga de esto
    },
  });

export default i18n;
