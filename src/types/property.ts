import type { IconName } from "lucide-react/dynamic";
import type { ColorName } from "@/lib/colors";

export type Property = {
  id: number;
  icon: IconName;
  name: string;
  value: string;
} & (
  | {
      type: "text";
      settings: {};
    }
  | {
      type: "date";
      settings: {};
    }
  | {
      type: "number";
      settings: {
        format: "number" | "slider" | "progress";
        prescission: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      };
    }
  | {
      type: "checkbox";
      settings: {
        showLabel: boolean;
        format: "check" | "switch";
      };
    }
  | {
      type: "select";
    }
  | {
      type: "status";
      settings: {
        options: {
          value: string;
          color: ColorName;
        }[];
      };
    }
);
