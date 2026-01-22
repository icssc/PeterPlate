"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Drawer,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import SidebarButton from "./sidebar-button";
import SidebarDivider from "./sidebar-divider";
import { Settings2, CalendarFold, LogOut, House, Info, Pin, Trophy, StarIcon, Heart, Star, User, NotebookPen, Carrot } from "lucide-react";
import { useSession, signOut } from "@/utils/auth-client"; // BetterAuth React hook
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { ThemeToggle } from "./theme-toggle";

interface SidebarContentProps {
  open: boolean;
  onClose: () => void;
}

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
}: SidebarContentProps): JSX.Element {
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

          <SidebarDivider title="Account" />

          <SidebarButton
            Icon={User}
            title="My Account"
            href="/account"
            onClose={onClose}
          />
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
                  <Typography
                    variant="body2"
                    className="text-gray-500"
                  >
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
                <LogOut size={18} />
              </IconButton>
            </Box>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}
