"use client";

import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Moon, PcCase, Sun } from "lucide-react";

const themes = ["system", "light", "dark"] as const;
const icons = {
  system: PcCase,
  light: Sun,
  dark: Moon,
} as const;

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex justify-center border rounded-full w-fit">
      {themes.map((th) => {
        const active = mounted && theme === th;
        const Icon = icons[th];
        return (
          <button
            key={th}
            type="button"
            aria-label={`Switch to ${th} theme`}
            onClick={() => setTheme(th)}
            className={cn(
              "w-[40px] h-[40px] flex items-center justify-center cursor-pointer",
              active && "border rounded-full p-2",
            )}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}
