"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InsertInvitation from "@mui/icons-material/InsertInvitation";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import MenuIcon from "@mui/icons-material/Menu";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar as MuiToolbar,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { useSession } from "@/utils/auth-client";
import SidebarContent from "./sidebar/sidebar-content";

export type CalendarRange = {
  earliest: Date;
  latest: Date;
};

// NOTE: Children take precedence over the href.
// Please only define one or the other.
/* Elements to be displayed in the toolbar */
type ToolbarElement = {
  /* The display name of the link */
  title: string;
  /* If present, will hyperlink to the href */
  href?: string;
  /* If present, will create a dropdown of each of the children */
  children?: { title: string; href: string }[];
  /* The link's icon (for mobile) */
  icon?: React.ReactNode;
};

const DESKTOP_TOOLBAR_ELEMENTS: ToolbarElement[] = [
  {
    title: "Dining Halls",
    children: [
      {
        title: "Brandywine",
        href: "/brandywine",
      },
      {
        title: "Anteatery",
        href: "/anteatery",
      },
    ],
  },
  {
    title: "Food Courts",
    children: [
      {
        title: "Phoenix Food Court",
        href: "/phoenix",
      },
      {
        title: "East Food Court",
        href: "/east-court",
      },
    ],
  },
  {
    title: "Events",
    href: "/events",
  },
  {
    title: "My Foods",
    href: "/my-foods",
  },
];

const MOBILE_TOOLBAR_ELEMENTS: ToolbarElement[] = [
  {
    title: "Home",
    href: "/",
    icon: <HomeRoundedIcon />,
  },
  {
    title: "Dining",
    href: "/brandywine", // defaults to brandywine
    icon: <RestaurantRoundedIcon />,
  },
  {
    title: "Events",
    href: "/events",
    icon: <InsertInvitation />,
  },
  {
    title: "My Foods",
    href: "/my-foods",
    icon: <FavoriteBorder />,
  },
  {
    title: "Tracker",
    href: "/tracker",
    icon: <ListAltRoundedIcon />,
  },
];

function ToolbarDropdown({ element }: { element: ToolbarElement }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon fontSize="small" />}
        className="capitalize text-[16px] font-medium
        group-hover:text-white text-white/60 bg-transparent"
      >
        {element.title}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="capitalize text-[16px] font-medium
        group-hover:text-white text-white/60 bg-transparent"
      >
        {element.children?.map((child) => (
          <MenuItem
            key={child.title}
            component={Link}
            href={child.href}
            onClick={handleClose}
          >
            {child.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function DesktopToolbar(): React.JSX.Element {
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const profileOpen = Boolean(profileAnchor);

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };
  const { data: session, isPending } = useSession();
  const user = session?.user;

  return (
    <>
      <AppBar
        position="absolute"
        className="bg-transparent shadow-none 
        hover:bg-gradient-to-b from-black/50 to-black/0"
      >
        <MuiToolbar className="justify-between px-4 py-1 group">
          <div className="flex-none flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                className="rounded-full cursor-pointer"
                src="/peterplate-icon.webp"
                alt="PeterPlate's Logo."
                width={40}
                height={40}
              />
              <span className="text-white font-poppins font-bold text-[28px] leading-[24px]">
                PeterPlate
              </span>
            </Link>
          </div>

          <nav className="flex-1 flex gap-0 justify-evenly">
            {DESKTOP_TOOLBAR_ELEMENTS.map((element) => {
              if (element.children) {
                return (
                  <ToolbarDropdown key={element.title} element={element} />
                );
              }
              return (
                <Button
                  key={element.title}
                  component={Link}
                  href={element.href || "#"}
                  className="group-hover:text-white normal-case text-[16px] 
                  !font-medium text-white/60"
                >
                  {element.title}
                </Button>
              );
            })}
          </nav>

          <div className="flex-none flex items-center gap-4">
            <div className="flex-none flex items-center gap-4">
              {isPending ? (
                <>
                  <div className="w-24 h-5" />
                  <IconButton
                    className="!text-[#1f2937] hover:!bg-[rgba(0, 0, 0, 0.04)]"
                    aria-label="Open sidebar"
                    disabled
                  >
                    <MenuIcon style={{ color: "white" }} />
                  </IconButton>
                </>
              ) : user ? (
                <IconButton
                  onClick={handleProfileOpen}
                  className="!p-0"
                  aria-label="Open profile menu"
                >
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={user.name || "User profile"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                </IconButton>
              ) : (
                <div className="flex items-center gap-2">
                  <GoogleSignInButton />
                  <IconButton
                    onClick={handleProfileOpen}
                    className="!text-[#1f2937] hover:!bg-[rgba(0,0,0,0.04)]"
                    aria-label="Open sidebar"
                  >
                    <MenuIcon style={{ color: "white" }} />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        </MuiToolbar>
      </AppBar>

      <Menu
        anchorEl={profileAnchor}
        open={profileOpen}
        onClose={handleProfileClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
            padding: 0,
            width: 357,
            maxHeight: 658,
            // borderRadius: 3,
            mt: 1,
          },
        }}
        MenuListProps={{
          sx: {
            padding: 0,
          },
        }}
      >
        <SidebarContent onClose={handleProfileClose} />
      </Menu>
    </>
  );
}

function MobileToolbar(): React.JSX.Element {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <DesktopToolbar />
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[520px]">
        <div
          className="
            rounded-[28px]
            px-4 py-3
            shadow-lg
            bg-gradient-to-b from-sky-700 to-sky-900
          "
        >
          <div className="flex items-center justify-between">
            {MOBILE_TOOLBAR_ELEMENTS.map((element) => {
              if (!element.href) return null;

              const active = isActive(element.href);

              return (
                <Link
                  key={element.title}
                  href={element.href}
                  className={`
                    flex flex-col items-center justify-center
                    w-[64px]
                    gap-1
                    transition
                    ${active ? "opacity-100" : "opacity-85 hover:opacity-100"}
                  `}
                >
                  <div
                    style={{
                      fontSize: 20,
                      color: "white",
                      opacity: active ? 1 : 0.9,
                    }}
                  >
                    {element.icon}
                  </div>
                  <span
                    className={`
                      text-[12px] leading-none text-white
                      ${active ? "font-semibold" : "font-medium"}
                    `}
                  >
                    {element.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Toolbar() {
  return (
    <>
      {/* Desktop toolbar */}
      <div className="hidden md:block">
        <DesktopToolbar />
      </div>

      {/* Mobile toolbar */}
      <div className="block md:hidden">
        <MobileToolbar />
      </div>
    </>
  );
}
