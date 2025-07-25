import { type ColorName, colors } from "@/lib/colors";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  colorName: ColorName;
  children: ReactNode;
}

export function ColorBadge({ colorName, children }: Props) {
  const color = colors[colorName];
  return (
    <Badge
      style={{ backgroundColor: color.secondary }}
      className={"text-black"}
    >
      <div
        style={{ backgroundColor: color.primary }}
        className={"h-4 rounded-full aspect-square"}
      />
      {children}
    </Badge>
  );
}
