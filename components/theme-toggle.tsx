"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "theme";
let themeTransitionTimer: ReturnType<typeof setTimeout> | undefined;

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;

  if (themeTransitionTimer) clearTimeout(themeTransitionTimer);
  root.classList.add("theme-transitioning");
  root.classList.toggle("dark", theme === "dark");
  localStorage.setItem(STORAGE_KEY, theme);

  themeTransitionTimer = setTimeout(() => {
    root.classList.remove("theme-transitioning");
    themeTransitionTimer = undefined;
  }, 200);
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark" | null>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as "light" | "dark" | null;
    const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
  }, []);

  if (theme === null) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" disabled aria-label="تبديل المظهر">
        <Sun className="h-[1.1rem] w-[1.1rem]" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  function toggle() {
    const next: "light" | "dark" = isDark ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full"
      onClick={toggle}
      aria-label={isDark ? "التبديل للوضع الفاتح" : "التبديل للوضع الداكن"}
    >
      <Sun
        className={cn(
          "h-[1.1rem] w-[1.1rem] transition-all duration-300",
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "absolute h-[1.1rem] w-[1.1rem] transition-all duration-300",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        )}
      />
    </Button>
  );
}