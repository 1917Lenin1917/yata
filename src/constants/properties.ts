import type { IconName } from "lucide-react/dynamic";

interface Property {
  icon: IconName;
  type: "text" | "date" | "number" | "status";
  settings?: object;
}

export const PROPERTIES = [
  {
    icon: "letter-text",
    type: "text",
  },
  {
    icon: "circle-dashed",
    type: "status",
    settings: {
      options: [],
    },
  },
  {
    icon: "decimals-arrow-right",
    type: "number",
  },
  {
    icon: "calendar",
    type: "date",
  },
] satisfies Property[];
