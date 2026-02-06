"use client";

import Link from "next/link";
import {
  Logout as LogoutIcon,
  Login as LoginIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  DesktopWindows as DesktopWindowsIcon,
  Feedback as FeedbackIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useSession, signOut } from "@/utils/auth-client";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";

interface ProfileMenuContentProps {
  onClose: () => void;
}

export default function SidebarContent({
  onClose,
}: ProfileMenuContentProps): JSX.Element {
  const { data: session } = useSession();
  const user = session?.user;
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "device">("dark");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };


  return (
    <div className="h-full w-full rounded-2xl bg-white dark:bg-gray-900 shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5">
        <div className="flex items-center gap-3">
          <img
            src={user?.image || "/peter.webp"}
            alt="Profile"
            className="w-11 h-11 rounded-full object-cover"
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
          onClick={onClose}
          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <CloseIcon sx={{ fontSize: 18 }} />
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
            <span className="rounded-md border border-blue-500 px-2.5 py-0.5 text-xs text-blue-600 dark:text-blue-400">
              Kosher
            </span>
          </div>

          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Allergies:
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-md border border-blue-500 px-2.5 py-0.5 text-xs text-blue-600 dark:text-blue-400">
              Tree Nuts
            </span>
            <span className="rounded-md border border-blue-500 px-2.5 py-0.5 text-xs text-blue-600 dark:text-blue-400">
              Soy
            </span>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Appearance
          </h3>

          <div className="flex rounded-lg border border-blue-500 overflow-hidden">
            <ThemeButton
              active={themeMode === "light"}
              onClick={() => setThemeMode("light")}
              icon={<LightModeIcon sx={{ fontSize: 16 }} />}
              label="Light"
            />
            <ThemeButton
              active={themeMode === "device"}
              onClick={() => setThemeMode("device")}
              icon={<DesktopWindowsIcon sx={{ fontSize: 16 }} />}
              label="Device"
            />
            <ThemeButton
              active={themeMode === "dark"}
              onClick={() => setThemeMode("dark")}
              icon={<DarkModeIcon sx={{ fontSize: 16 }} />}
              label="Dark"
            />
          </div>
        </div>

        {/* Links */}
        <div className="space-y-1">
          <MenuLink
            href="/account"
            onClick={onClose}
            icon={<EditIcon fontSize="small" />}
          >
            Edit Preferences
          </MenuLink>

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

      {/* Sign out
      <div className="px-5 pb-5 pt-3">
        <button
          onClick={handleSignOut}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <span className="inline-flex items-center gap-2">
            <LogoutIcon fontSize="small" />
            Sign Out
          </span>
        </button>
      </div>
    </div> */}
    {/* Auth action */}
    <div className="px-5 pb-5 pt-3">
      {user ? (
        <button
          onClick={handleSignOut}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
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
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
        active
          ? "bg-blue-100 text-blue-700"
          : "text-blue-600 hover:bg-blue-50"
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
  icon: React.ReactNode;
  children: React.ReactNode;
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
