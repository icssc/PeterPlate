"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <div
      role="button"
      onClick={toggleTheme}
      className="flex w-full items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer select-none hover:bg-accent hover:text-accent-foreground group"
    >
      <div className="flex gap-3 items-center">
        {isDark ? (
          <Sun className="stroke-1 size-5" />
        ) : (
          <Moon className="stroke-1 size-5" />
        )}
        <span className="text-md font-medium">
          {isDark ? "Light mode" : "Dark mode"}
        </span>
      </div>

      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        onClick={(e) => e.stopPropagation()}
        className="translate-y-[1px]"
      />
    </div>
  );
}