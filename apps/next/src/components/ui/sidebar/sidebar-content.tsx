"use client";

import Link from "next/link";
import { LogOut, Info, Pencil, Sun, Monitor, Moon, MessageSquare, X } from "lucide-react";
import { useSession, signOut } from "@/utils/auth-client";
import { useState } from "react";

interface ProfileMenuContentProps {
  onClose: () => void;
}

export default function ProfileMenuContent({
  onClose,
}: ProfileMenuContentProps): JSX.Element {
  const { data: session } = useSession();
  const user = session?.user;
  const [themeMode, setThemeMode] = useState<string>("dark");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="w-full max-w-[600px] rounded-2xl bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-7">
        <div className="flex items-center gap-4">
          <img
            src={user?.image || "/peter.webp"}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {user?.name || "Peter Anteater"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || "panteater@uci.edu"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X size={18} />
        </button>
      </div>

      {/* Dietary Preferences */}
      <div className="px-6 pt-7">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
          Dietary Preferences
        </h3>

        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Restrictions:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="rounded-lg border border-blue-500 px-3 py-1 text-sm text-blue-600 dark:text-blue-400">
            Kosher
          </span>
        </div>

        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Allergies:
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg border border-blue-500 px-3 py-1 text-sm text-blue-600 dark:text-blue-400">
            Tree Nuts
          </span>
          <span className="rounded-lg border border-blue-500 px-3 py-1 text-sm text-blue-600 dark:text-blue-400">
            Soy
          </span>
        </div>
      </div>

      {/* Appearance */}
      <div className="px-6 pt-7">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
          Appearance
        </h3>

        <div className="flex rounded-xl border border-blue-500 overflow-hidden">
          <ThemeButton
            active={themeMode === "light"}
            onClick={() => setThemeMode("light")}
            icon={<Sun size={18} />}
            label="Light"
          />
          <ThemeButton
            active={themeMode === "device"}
            onClick={() => setThemeMode("device")}
            icon={<Monitor size={18} />}
            label="Device"
          />
          <ThemeButton
            active={themeMode === "dark"}
            onClick={() => setThemeMode("dark")}
            icon={<Moon size={18} />}
            label="Dark"
          />
        </div>
      </div>

      {/* Links */}
      <div className="px-4 pt-6 space-y-1">
          <MenuLink href="/feedback" onClick={onClose} icon={<MessageSquare size={20} />}>
          Feedback
        </MenuLink>
        <MenuLink href="/account" onClick={onClose} icon={<Pencil size={20} />}>
          Edit Preferences
        </MenuLink>
        <MenuLink href="/about" onClick={onClose} icon={<Info size={20} />}>
          About PeterPlate
        </MenuLink>
      </div>

      {/* Sign out */}
      <div className="px-6 py-7">
        <button
          onClick={handleSignOut}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <span className="inline-flex items-center gap-2">
            <LogOut size={18} />
            Sign Out
          </span>
        </button>
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
      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
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
      className="flex items-center gap-4 rounded-xl px-4 py-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  );
}
