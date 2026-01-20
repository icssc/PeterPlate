"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Button } from "../shadcn/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full justify-between [&_svg]:size-5"
      onClick={toggleTheme}
    >
      <div className="flex gap-3 items-center">
        {isDark ? <Sun className="stroke-1" /> : <Moon className="stroke-1" />}
        <span className="text-md">{isDark ? "Light mode" : "Dark mode"}</span>
      </div>

      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        onClick={(e) => e.stopPropagation()}
        className="translate-y-[1px]"
      />
    </Button>
  );
}