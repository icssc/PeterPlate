"use client";

import {
  CalendarToday,
  EditNote,
  EggAlt,
  EmojiEvents,
  FavoriteBorder,
  House,
  Info,
  Logout,
  Person,
  Settings,
  StarBorder,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import type React from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { signOut, useSession } from "@/utils/auth-client"; // BetterAuth React hook
import SidebarButton, { type SidebarButtonProps } from "./sidebar-button";
import SidebarDivider from "./sidebar-divider";
import { ThemeToggle } from "./theme-toggle";

interface SidebarContentProps {
  open: boolean;
  onClose: () => void;
}

type SidebarSection = {
  title: string;
  buttons: SidebarButtonProps[];
};

const SIDEBAR_CONTENT_MAP: SidebarSection[] = [
  {
    title: "Dining Hall Info",
    buttons: [
      {
        Icon: House,
        title: "Home",
        href: "/",
      },
      {
        Icon: CalendarToday,
        title: "Events",
        href: "/events",
      },
      {
        Icon: EmojiEvents,
        title: "Most Liked",
        href: "/leaderboard",
        deactivated: true,
      },
      {
        Icon: EggAlt,
        title: "Nutrition",
        href: "/nutrition",
      },
    ],
  },
  {
    title: "Account",
    buttons: [
      {
        Icon: Person,
        title: "My Account",
        href: "/account",
      },
      {
        Icon: StarBorder,
        title: "My Ratings",
        href: "/ratings",
      },
      {
        Icon: FavoriteBorder,
        title: "My Favorites",
        href: "/my-favorites",
      },
      {
        Icon: EditNote,
        title: "My Meal Tracker",
        href: "/meal-tracker",
        deactivated: true,
      },
    ],
  },
  {
    title: "Miscellaneous",
    buttons: [
      {
        Icon: Settings,
        title: "Settings",
        href: "/settings",
        deactivated: true,
      },
      {
        Icon: Info,
        title: "About",
        href: "/about",
      },
    ],
  },
];

/**
 * `SidebarContent` is a presentational component that renders the main content
 * displayed within the application's sidebar.
 *
 * It includes:
 * - A header section with the application logo and title.
 * - Navigation links using {@link SidebarButton} and section separators using {@link SidebarDivider}.
 * - A user profile section at the bottom with an avatar, user details, and a logout button.
 * @returns {JSX.Element} The rendered content for the sidebar.
 */
export default function SidebarContent({
  open,
  onClose,
}: SidebarContentProps): React.JSX.Element {
  // Get session data using BetterAuth's React hook
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box className="flex h-full w-[280px] flex-col justify-between p-4">
        {/* Top */}
        <Stack className="space-y-2">
          {/* Header */}
          <Stack direction="row" className="items-center gap-3">
            <Image
              src="/ZotMeal-Logo.webp"
              width={32}
              height={32}
              alt="ZotMeal Logo"
            />

            <Typography variant="h6" className="font-semibold">
              ZotMeal{" "}
              <Typography
                component="span"
                variant="body2"
                className="text-gray-500"
              >
                v0.1 (preview)
              </Typography>
            </Typography>
          </Stack>

          <Divider className="my-2" />

          {SIDEBAR_CONTENT_MAP.map((section) => (
            <div key={section.title}>
              <SidebarDivider title={section.title} />
              {section.buttons.map((button) => (
                <SidebarButton key={button.title} {...button} />
              ))}
            </div>
          ))}
        </Stack>

        {/* Bottom */}
        <Stack className="space-y-2">
          <ThemeToggle />
          {!isPending && !user && <GoogleSignInButton />}

          {!isPending && user && (
            <Box className="flex items-center justify-between rounded-md p-2 hover:bg-gray-100">
              <Stack direction="row" className="items-center gap-3">
                <Avatar
                  src={user.image || "/peter.webp"}
                  alt={user.name || "User"}
                  variant="rounded"
                  className="h-10 w-10"
                >
                  {user.name?.[0]?.toUpperCase() ||
                    user.email?.[0]?.toUpperCase() ||
                    "U"}
                </Avatar>

                <Box>
                  <Typography className="font-semibold leading-tight">
                    {user.name || "User"}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {user.email || ""}
                  </Typography>
                </Box>
              </Stack>

              <IconButton
                onClick={handleSignOut}
                aria-label="Log out"
                size="small"
                className="hover:bg-gray-200"
              >
                <Logout fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}
