import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow, differenceInSeconds } from "date-fns";
import { ru as ruLocale, enUS } from "date-fns/locale";

type UpdatedAgoOpts = {
  refreshMs?: number;
  justNowSeconds?: number;
  prefix?: boolean;
};

export function useUpdatedAgo(
  input: Date | string | number,
  {
    refreshMs = 60_000,
    justNowSeconds = 30,
    prefix = true,
  }: UpdatedAgoOpts = {},
) {
  const { t, i18n } = useTranslation();

  const compute = () => {
    const dateValue = new Date(input);
    const isRu = i18n.language === "ru";
    const locale = isRu ? ruLocale : enUS;

    if (Number.isNaN(dateValue.getTime())) return t("time.unknown");
    if (differenceInSeconds(new Date(), dateValue) < justNowSeconds) {
      const just = t("time.justNow");
      return prefix ? `${t("time.updated")} ${just}` : just;
    }
    const phrase = formatDistanceToNow(dateValue, { addSuffix: true, locale });
    return prefix ? `${t("time.updated")} ${phrase}` : phrase;
  };

  const [label, setLabel] = useState(compute);

  useEffect(() => {
    setLabel(compute());
    const id = setInterval(() => setLabel(compute()), refreshMs);
    return () => clearInterval(id);
  }, [input, i18n.language, refreshMs, justNowSeconds, prefix]);

  return label;
}
