"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const activeClass = "border rounded-full p-2";
const baseClass =
  "w-[40px] h-[40px] flex flex-wrap items-center justify-center cursor-pointer";

export default function LangSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className={"flex justify-center border rounded-full w-fit"}>
      <div
        onClick={() => i18n.changeLanguage("ru")}
        className={cn(
          baseClass,
          i18n.language === "ru" ? activeClass : undefined,
        )}
      >
        <Image width={20} height={20} src={"/icons/ru.svg"} alt={"ru"} />
      </div>
      <div
        onClick={() => i18n.changeLanguage("en")}
        className={cn(
          baseClass,
          i18n.language === "en" ? activeClass : undefined,
        )}
      >
        <Image width={20} height={20} src={"/icons/en.svg"} alt={"en"} />
      </div>
    </div>
  );
}
