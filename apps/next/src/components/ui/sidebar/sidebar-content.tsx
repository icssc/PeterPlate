"use client";

import {
  Close as CloseIcon,
  Edit as EditIcon,
  Feedback as FeedbackIcon,
  HelpOutlineOutlined as HelpIcon,
  InfoOutlined as InfoIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { SignInButtons } from "@/components/auth/sign-in-buttons";
import AppearancePicker from "@/components/ui/appearance-picker";
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
    const userTheme = localStorage.getItem("theme");
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
        <AppearancePicker />

        {/* Links */}
        <div className="space-y-1 pb-2">
          {user ? (
            <Tooltip title={!user ? "Please login to edit preferences." : ""}>
              <span className="block">
                <button
                  type="button"
                  disabled={!user}
                  onClick={() => {
                    onClose();
                    onEditPreferencesClick();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-900 hover:bg-sky-50 dark:text-white dark:hover:bg-blue-300/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:dark:hover:bg-transparent"
                >
                  <Box sx={{ color: "primary.main" }}>
                    <EditIcon fontSize="small" />
                  </Box>
                  <span>Edit Preferences</span>
                </button>
              </span>
            </Tooltip>
          ) : null}

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
