import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import ru from "./ru.json";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

i18next
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    ns: "common",
    resources: {
      en,
      ru,
    },
    react: { useSuspense: false },
    detection: {
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18next;
