"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import i18next from "@/i18n/i18next";

export function useI18n() {
  const { lng } = useParams() as { lng: string };
  useEffect(() => {
    i18next.changeLanguage(lng);
  }, [lng]);
  return { t: i18next.getFixedT(lng, "common") };
}
