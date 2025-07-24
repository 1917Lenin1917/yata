export type ColorName =
  | "yellow"
  | "lime"
  | "blue"
  | "gray"
  | "rose"
  | "red"
  | "orange"
  | "amber"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "stone"
  | "neutral"
  | "slate"
  | "zinc";
export type Color = { primary: string; secondary: string };

export const colors = {
  yellow: { primary: "#facc15", secondary: "#fde68a" }, // 400 / 200
  lime: { primary: "#84cc16", secondary: "#d9f99d" }, // 500 / 200
  blue: { primary: "#3b82f6", secondary: "#93c5fd" }, // 500 / 300
  gray: { primary: "#6b7280", secondary: "#d1d5db" }, // 500 / 300
  rose: { primary: "#fb7185", secondary: "#fecdd3" }, // 400 / 200
  red: { primary: "#ef4444", secondary: "#fca5a5" }, // 500 / 300
  orange: { primary: "#f97316", secondary: "#fdba74" }, // 500 / 300
  amber: { primary: "#f59e0b", secondary: "#fcd34d" }, // 500 / 300
  emerald: { primary: "#10b981", secondary: "#6ee7b7" }, // 500 / 300
  teal: { primary: "#14b8a6", secondary: "#5eead4" }, // 500 / 300
  cyan: { primary: "#06b6d4", secondary: "#67e8f9" }, // 500 / 300
  sky: { primary: "#0ea5e9", secondary: "#7dd3fc" }, // 500 / 300
  indigo: { primary: "#6366f1", secondary: "#a5b4fc" }, // 500 / 300
  violet: { primary: "#8b5cf6", secondary: "#c4b5fd" }, // 500 / 300
  purple: { primary: "#a855f7", secondary: "#d8b4fe" }, // 500 / 300
  fuchsia: { primary: "#d946ef", secondary: "#f0abfc" }, // 500 / 300
  stone: { primary: "#78716c", secondary: "#d6d3d1" }, // 500 / 300
  neutral: { primary: "#737373", secondary: "#d4d4d4" }, // 500 / 300
  slate: { primary: "#64748b", secondary: "#cbd5e1" }, // 500 / 300
  zinc: { primary: "#71717a", secondary: "#d4d4d8" }, // 500 / 300
} as const satisfies Record<ColorName, Color>;
