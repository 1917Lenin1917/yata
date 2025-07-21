export type ColorName = "yellow" | "lime" | "blue" | "gray";
export type Color = { primary: string; secondary: string };

export const colors: Record<ColorName, Color> = {
  yellow: {
    primary: "#fde68a",
    secondary: "",
  },
  lime: {
    primary: "#86efac",
    secondary: "",
  },
  blue: {
    primary: "#60a5fa",
    secondary: "",
  },
  gray: {
    primary: "#9ca3af",
    secondary: "",
  },
};
