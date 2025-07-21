"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LOCALES } from "@/constants/locale";

export default function LangSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={"flex justify-center border rounded-full w-fit"}>
      {LOCALES.map((locale, key) => (
        <div
          key={key}
          onClick={() => i18n.changeLanguage(locale)}
          className={cn(
            "w-[40px] h-[40px] flex flex-wrap items-center justify-center cursor-pointer",
            mounted && i18n.language === locale
              ? "border rounded-full p-2"
              : undefined,
          )}
        >
          <Image
            width={20}
            height={20}
            src={`/icons/${locale}.svg`}
            alt={locale}
          />
        </div>
      ))}
    </div>
  );
}
