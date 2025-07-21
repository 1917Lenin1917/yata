export type ColorName = "yellow" | "lime" | "blue";
export type Color = { primary: string; secondary: string };

export const colors: Record<ColorName, Color> = {
  yellow: {
    primary: "amber-200",
    secondary: "",
  },
  lime: {
    primary: "green-300",
    secondary: "",
  },
  blue: {
    primary: "blue-400",
    secondary: "",
  },
};
