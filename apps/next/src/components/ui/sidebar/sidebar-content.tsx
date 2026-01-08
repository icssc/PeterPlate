"use client";

import Image from "next/image";
import Link from "next/link";
import { SheetContent, SheetTitle, SheetClose } from "../shadcn/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "../shadcn/avatar";
import { Button } from "../shadcn/button";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import SidebarButton from "./sidebar-button";
import SidebarDivider from "./sidebar-divider";
import { Settings2, CalendarFold, LogOut, House, Info, Pin, Trophy, StarIcon, Heart, Star, User, NotebookPen, Carrot } from "lucide-react";
import { useSession, signOut } from "@/utils/auth-client"; // BetterAuth React hook
import { ThemeToggle } from "./theme-toggle";

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
export default function SidebarContent(): JSX.Element {
  // Get session data using BetterAuth's React hook
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect after successful sign out
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <SheetContent>
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col gap-1" id="sheet-top">
          <div className="flex gap-2 items-center" id="zotmeal-sheet-header">
            <Image
              src="/ZotMeal-Logo.webp"
              width={32}
              height={32}
              alt="ZotMeal Logo"
              className="rounded-sm"
            />
            <SheetTitle>
              <span>ZotMeal </span>
              <span className="text-sm font-normal">v0.1 (preview)</span>
            </SheetTitle>
          </div>
          <SidebarDivider title="Dining Hall Info"/>
          <SidebarButton Icon={House} title="Home" href="/"/>
          <SidebarButton Icon={CalendarFold} title="Events" href="/events"/>
          <SidebarButton Icon={Trophy} title="Most Liked" href="/leaderboard" deactivated/>
          <SidebarButton Icon={Carrot} title="Nutrition" href="/nutrition"/>

          <SidebarDivider title="Account"/>
          <SidebarButton Icon={User} title="My Account" href="/account"/>
          <SidebarButton Icon={Star} title="My Ratings" href="/ratings"/>
          <SidebarButton Icon={Heart} title="My Favorites" href="/my-favorites"/>
          <SidebarButton Icon={NotebookPen} title="My Meal Tracker" href="/meal-tracker" deactivated/>

          <SidebarDivider title="Miscellaneous"/>
          <ThemeToggle />
          <SidebarButton Icon={Settings2} title="Settings" href="/settings" deactivated/>
          <SidebarButton Icon={Info} title="About" href="/about"/>
        </div>

        {/* Sign in Button if user not logged in  */}
        {!isPending && !user && <GoogleSignInButton />}
        
        {/* User profile is user logged in*/}
        {!isPending && user && (
          <div className="flex p-2 items-center justify-between rounded-md hover:bg-muted-100 transition-colors" id="sheet-bottom">
            <div className="flex gap-3 items-center">
              <Avatar className="rounded-md">
                <AvatarImage 
                  src={user.image || "/peter.webp"} 
                  alt={`@${user.name || 'user'}`}
                />
                <AvatarFallback>
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col" id="user-info">
                <strong id="user-name">
                  {user.name || "User"}
                </strong>
                <span className="text-sm" id="user-email">
                  {user.email || ""}
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSignOut}
              aria-label="Log out"
            >
              <LogOut/>
            </Button>
          </div>
        )}
      </div>
    </SheetContent>
  );
}
