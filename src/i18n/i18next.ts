// src/app/i18n/i18next.ts
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/common.json";
import ru from "./locales/ru/common.json";

if (!i18next.isInitialized) {
  console.log("init!");
  i18next.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    resources: {
      en,
      ru,
    },
    react: { useSuspense: false },
  });
}

export default i18next;
