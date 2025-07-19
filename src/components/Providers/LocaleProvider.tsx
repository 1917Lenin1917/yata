"use client";

import { I18nextProvider } from "react-i18next";
import type { ReactNode } from "react";
import i18next from "@/app/i18n/i18next";

export default function LocaleProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
