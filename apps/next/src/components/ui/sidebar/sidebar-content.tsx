"use client";

import {
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  DesktopWindows as DesktopWindowsIcon,
  Edit as EditIcon,
  Feedback as FeedbackIcon,
  Info as InfoIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { signOut, useSession } from "@/utils/auth-client";
import { formatDietaryKey } from "@/utils/dietary";
import { trpc } from "@/utils/trpc";

interface ProfileMenuContentProps {
  onClose: () => void;
  onEditPreferencesClick: () => void;
}

export default function SidebarContent({
  onClose,
  onEditPreferencesClick,
}: ProfileMenuContentProps) {
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

  if (!mounted) return null;

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-900 shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5">
        <div className="flex items-center gap-3">
          <Image
            src={user?.image || "/peter.webp"}
            alt="Profile"
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              {user?.name || "Peter Anteater"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email || "panteater@uci.edu"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-4 space-y-5">
        {/* Dietary Preferences */}
        <div>
          <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Dietary Preferences
          </h3>

          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Restrictions:
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {preferences?.length ? (
              preferences.map((pref) => (
                <span
                  key={pref}
                  className="rounded-md border border-blue-500 px-2.5 py-0.5 text-xs text-blue-600 dark:text-blue-400"
                >
                  {formatDietaryKey(pref)}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">None</span>
            )}
          </div>

          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Allergies:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {allergies?.length ? (
              allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="rounded-md border border-blue-500 px-2.5 py-0.5 text-xs text-blue-600 dark:text-blue-400"
                >
                  {formatDietaryKey(allergy)}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">None</span>
            )}
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Appearance
          </h3>

          <div className="flex rounded-lg border border-blue-500 overflow-hidden">
            <ThemeButton
              active={theme === "light"}
              onClick={() => setTheme("light")}
              icon={<LightModeIcon fontSize="small" />}
              label="Light"
            />
            <ThemeButton
              active={theme === "system"}
              onClick={() => setTheme("system")}
              icon={<DesktopWindowsIcon fontSize="small" />}
              label="Device"
            />
            <ThemeButton
              active={theme === "dark"}
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
                className="w-full flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:dark:hover:bg-transparent"
              >
                <EditIcon fontSize="small" />
                <span className="font-semibold">Edit Preferences</span>
              </button>
            </span>
          </Tooltip>

          <MenuLink
            href="/feedback"
            onClick={onClose}
            icon={<FeedbackIcon fontSize="small" />}
          >
            Feedback
          </MenuLink>

          <MenuLink
            href="/about"
            onClick={onClose}
            icon={<InfoIcon fontSize="small" />}
          >
            About PeterPlate
          </MenuLink>
        </div>
      </div>

      {/* Sign out */}

      <div className="px-5 pb-5 pt-3">
        {user ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full rounded-lg bg-blue-600
            py-2.5 text-sm font-semibold text-white
            hover:bg-blue-700 flex items-center justify-center"
          >
            <span className="inline-flex items-center gap-2">
              <LogoutIcon fontSize="small" />
              Sign Out
            </span>
          </button>
        ) : (
          <GoogleSignInButton />
        )}
      </div>
    </div>
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
      className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
        active ? "bg-blue-100 text-blue-700" : "text-blue-600 hover:bg-blue-50"
      }`}
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
      className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  );
}
