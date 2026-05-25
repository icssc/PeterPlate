"use client";

import {
  DarkMode as DarkModeIcon,
  DesktopWindows as DesktopWindowsIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useTheme } from "next-themes";
import type React from "react";
import type { ReactNode } from "react";
import { cn } from "@/utils/tw";

type AppearancePickerProps = {
  className?: string;
};

export default function AppearancePicker({
  className,
}: AppearancePickerProps): React.JSX.Element {
  const { theme, setTheme } = useTheme();

  return (
    <div className={className}>
      <Typography variant="body2" fontWeight={600} color="primary" mb={1}>
        Appearance
      </Typography>

      <div className="flex overflow-hidden rounded-lg border border-sky-700 dark:border-blue-300">
        <AppearanceButton
          active={theme === "light"}
          onClick={() => setTheme("light")}
          icon={<LightModeIcon fontSize="small" />}
          label="Light"
        />
        <AppearanceButton
          active={theme === "system"}
          onClick={() => setTheme("system")}
          icon={<DesktopWindowsIcon fontSize="small" />}
          label="Device"
        />
        <AppearanceButton
          active={theme === "dark"}
          onClick={() => setTheme("dark")}
          icon={<DarkModeIcon fontSize="small" />}
          label="Dark"
        />
      </div>
    </div>
  );
}

function AppearanceButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-1 py-2 text-xs font-medium transition-colors",
        active
          ? "bg-sky-700 text-white dark:bg-blue-300 dark:text-gray-900"
          : "text-gray-700 hover:bg-sky-100 dark:text-white dark:hover:bg-zinc-700",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
