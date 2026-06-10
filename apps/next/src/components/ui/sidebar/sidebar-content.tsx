"use client";

import {
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  DesktopWindows as DesktopWindowsIcon,
  Edit as EditIcon,
  ContentPaste as FeedbackIcon,
  HelpOutlineOutlined as HelpIcon,
  InfoOutlined as InfoIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import type React from "react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { SignInButtons } from "@/components/auth/sign-in-buttons";
import { signOut, useSession } from "@/utils/auth-client";
import { formatDietaryKey } from "@/utils/dietary";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/tw";

interface ProfileMenuContentProps {
  onClose: () => void;
  onEditPreferencesClick: () => void;
}

export default function SidebarContent({
  onClose,
  onEditPreferencesClick,
}: ProfileMenuContentProps): React.JSX.Element | null {
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data: preferences } = trpc.preference.getDietaryPreferences.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId },
  );

  const { data: allergies } = trpc.allergy.getAllergies.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId },
  );

  const handleSignOut = async () => {
    const userTheme = theme ?? localStorage.getItem("theme");
    await signOut();
    if (userTheme) {
      localStorage.setItem("theme", userTheme);
    }
    window.location.href = "/";
  };

  return (
    <Box
      className={`w-full h-full rounded-2xl bg-white 
        dark:bg-[var(--surface-elevated)] shadow-xl flex flex-col border-2 
        border-gray-300 dark:border-zinc-700`}
      sx={{ border: 1, borderColor: "divider" }}
    >
      {/* Header */}
      <div
        className={`flex items-start justify-between px-5 p-5 border-b-2 
        border-gray-300 dark:border-zinc-700`}
      >
        <div className="flex items-center gap-3">
          <Image
            src={user?.image || "/peter.webp"}
            alt="Profile"
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
          <div>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {user?.name || "Peter Anteater"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || "panteater@uci.edu"}
            </Typography>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <CloseIcon sx={{ fontSize: 18, color: "text.primary" }} />
        </button>
      </div>

      <hr className="border-t border-gray-200 dark:border-gray-700 mx-5 mt-4" />

      {/* Content */}
      <div className="flex-1 px-5 p-4 space-y-5 border-b-2 border-gray-300 dark:border-zinc-700">
        {/* Dietary Preferences */}
        <div>
          <Typography className="text-sm font-bold text-sky-700 dark:text-accent-primary mb-2">
            Dietary Preferences
          </Typography>

          <Typography className="text-xs font-semibold text-gray-500 dark:text-zinc-300 mb-1">
            Restrictions:
          </Typography>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {preferences?.length ? (
              preferences.map((pref) => (
                <PrefBadge key={pref} type="restriction" text={pref} />
              ))
            ) : (
              <span className="text-xs text-gray-400 dark:text-zinc-300">
                None
              </span>
            )}
          </div>

          <Typography className="text-xs font-semibold text-gray-500 dark:text-zinc-300 mb-1">
            Allergies:
          </Typography>
          <div className="flex flex-wrap gap-1.5">
            {allergies?.length ? (
              allergies.map((allergy) => (
                <PrefBadge key={allergy} type="allergy" text={allergy} />
              ))
            ) : (
              <span className="text-xs text-gray-400 dark:text-zinc-300">
                None
              </span>
            )}
          </div>
        </div>

        {/* Appearance */}
        <div>
          <Typography className="text-sm font-bold text-sky-700 dark:text-accent-primary mb-2">
            Appearance
          </Typography>

          <div
            className={`flex rounded-lg border border-sky-700 
            dark:border-blue-300 overflow-hidden divide-x divide-sky-700 
            dark:divide-blue-300`}
          >
            <ThemeButton
              active={mounted && theme === "light"}
              onClick={() => setTheme("light")}
              icon={<LightModeIcon fontSize="small" />}
              label="Light"
            />
            <div className="w-px self-stretch border-l border-sky-700 relative z-10" />
            <ThemeButton
              active={mounted && theme === "system"}
              onClick={() => setTheme("system")}
              icon={<DesktopWindowsIcon fontSize="small" />}
              label="Device"
            />
            <div className="w-px self-stretch border-l border-sky-700 relative z-10" />
            <ThemeButton
              active={mounted && theme === "dark"}
              onClick={() => setTheme("dark")}
              icon={<DarkModeIcon fontSize="small" />}
              label="Dark"
            />
          </div>
        </div>

        {/* Links */}
        <div className="space-y-1">
          <Tooltip title={!user ? "Please login to edit preferences." : ""}>
            <span className="block">
              <button
                type="button"
                disabled={!user}
                onClick={() => {
                  onClose();
                  onEditPreferencesClick();
                }}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-2 
                  text-sm text-gray-900 dark:text-white hover:bg-gray-100 
                  dark:hover:bg-gray-700 disabled:opacity-50 
                  disabled:cursor-not-allowed disabled:hover:bg-transparent 
                  disabled:dark:hover:bg-transparent`}
              >
                <EditIcon
                  fontSize="small"
                  sx={{ color: "hsl(var(--accent-primary))" }}
                />
                <span className="font-medium">Edit Preferences</span>
              </button>
            </span>
          </Tooltip>

          <MenuLink
            href="/feedback"
            onClick={onClose}
            icon={
              <FeedbackIcon
                fontSize="small"
                sx={{ color: "hsl(var(--accent-primary))" }}
              />
            }
          >
            Feedback
          </MenuLink>

          <MenuLink
            href="/about"
            onClick={onClose}
            icon={
              <InfoIcon
                fontSize="small"
                sx={{ color: "hsl(var(--accent-primary))" }}
              />
            }
          >
            About PeterPlate
          </MenuLink>

          <MenuLink
            href="/about"
            onClick={onClose}
            icon={
              <HelpIcon
                fontSize="small"
                sx={{ color: "hsl(var(--accent-primary))" }}
              />
            }
          >
            Onboarding Tutorial
          </MenuLink>
        </div>
      </div>

      {/* Sign out */}

      <div className="p-5">
        {user ? (
          <button
            type="button"
            onClick={handleSignOut}
            className={`w-full rounded-lg bg-sky-700 py-2.5 text-sm font-medium 
              text-white hover:bg-sky-800 dark:bg-blue-300 dark:text-gray-900 
              dark:hover:bg-blue-400 flex items-center justify-center`}
          >
            <LogoutIcon fontSize="small" />
            Sign Out
          </button>
        ) : (
          <SignInButtons />
        )}
      </div>
    </Box>
  );
}

function ThemeButton({
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
        `flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium transition-colors`,
        active && "bg-sky-700 text-white dark:bg-blue-300 dark:text-gray-900",
        !active &&
          "text-gray-700 hover:bg-sky-100 dark:text-white dark:hover:bg-zinc-700 ",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function MenuLink({
  href,
  onClick,
  icon,
  children,
}: {
  href: string;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-gray-100
        dark:hover:bg-gray-700`}
    >
      <Box sx={{ color: "primary.main" }}>{icon}</Box>
      <Typography variant="body2" fontWeight={500} color="text.primary">
        {children}
      </Typography>
    </Link>
  );
}

const PrefBadge = ({
  text,
  type,
}: {
  text: string;
  type: "restriction" | "allergy";
}) => {
  return (
    <span
      className={cn(
        `rounded-md px-3 py-1 text-xs font-bold text-white`,
        type === "restriction" && "bg-red-600",
        type === "allergy" && "bg-orange-500",
      )}
    >
      {formatDietaryKey(text)}
    </span>
  );
};
