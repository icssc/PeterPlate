"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InfoIcon from "@mui/icons-material/Info";
import InsertInvitation from "@mui/icons-material/InsertInvitation";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import MenuIcon from "@mui/icons-material/Menu";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import {
  AppBar,
  Button,
  Dialog,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar as MuiToolbar,
  Snackbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSession } from "@/utils/auth-client";
import EditPreferencesContent from "./edit-preferences-content";
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
    title: "Events",
    href: "/events",
  },
  {
    title: "My Foods",
    href: "/my-foods",
  },
  {
    title: "Tracker",
    href: "/nutrition",
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
    href: "/brandywine", // defaults to brandywine for now, we'd need to add anteatery
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
    href: "/nutrition",
    icon: <ListAltRoundedIcon />,
  },
];

const TRANSPARENT_PAGES = ["/about", "/brandywine", "/anteatery"];

function ToolbarDropdown({
  element,
  isTransparent,
  pathname,
}: {
  element: ToolbarElement;
  isTransparent: boolean;
  pathname: string;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
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
        className={`capitalize text-[16px] !font-medium bg-transparent ${
          isTransparent ? "text-white" : "!text-black dark:!text-white"
        }`}
      >
        {element.title}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="capitalize text-[16px] font-medium
        group-hover:text-white text-white/60 bg-transparent"
        slotProps={{
          paper: {
            sx: {
              backgroundImage: "none",
              bgcolor: "#ffffff",
              ".dark &": {
                bgcolor: "#323235",
              },
            },
          },
        }}
      >
        {element.children?.map((child) => (
          <MenuItem
            key={child.title}
            component={Link}
            href={child.href}
            onClick={handleClose}
            sx={{
              color: pathname === child.href ? "primary.main" : "text.primary",
              "&.Mui-selected": { backgroundColor: "transparent" },
              borderLeft:
                pathname === child.href ? "3px solid" : "3px solid transparent",
              borderColor:
                pathname === child.href ? "primary.main" : "transparent",
            }}
          >
            {child.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function GuestToolbarMenu({
  isTransparent,
  disabled = false,
  buttonClassName = "",
}: {
  isTransparent: boolean;
  disabled?: boolean;
  buttonClassName?: string;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        aria-label="Open menu"
        className={`${
          isTransparent ? "!text-white" : "!text-[#1f2937] dark:!text-white"
        } ${buttonClassName}`}
      >
        <MenuIcon
          sx={{
            color: disabled
              ? "action.disabled"
              : isTransparent
                ? "white"
                : "text.primary",
          }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          className:
            "mt-1 w-[280px] rounded-xl border border-gray-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-[#323235]",
          sx: {
            backgroundImage: "none",
          },
        }}
        MenuListProps={{
          className: "p-2",
        }}
      >
        <MenuItem
          component={Link}
          href="/about"
          onClick={handleClose}
          className="!rounded-lg !px-3 !py-2"
        >
          <InfoIcon
            fontSize="small"
            className="mr-3 text-sky-700 dark:text-blue-300"
          />
          About PeterPlate
        </MenuItem>
        <MenuItem
          component={Link}
          href="/feedback"
          onClick={handleClose}
          className="!rounded-lg !px-3 !py-2"
        >
          <FeedbackIcon
            fontSize="small"
            className="mr-3 text-sky-700 dark:text-blue-300"
          />
          Feedback Form
        </MenuItem>
        <li className="mt-2 list-none border-t border-gray-200 p-2 dark:border-zinc-700">
          <GoogleSignInButton />
        </li>
      </Menu>
    </>
  );
}

export function DesktopToolbar(): React.JSX.Element {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const isTransparent = TRANSPARENT_PAGES.includes(pathname);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const profileOpen = Boolean(profileAnchor);
  const [editPreferencesOpen, setEditPreferencesOpen] = useState(false);
  const [editPreferencesSnackbarOpen, setEditPreferencesSnackbarOpen] =
    useState(false);
  const [editPreferencesExpanded, setEditPreferencesExpanded] = useState(false);

  const handleProfileOpen = (event: MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };
  const handleEditPreferencesOpen = () => {
    setEditPreferencesOpen(true);
  };
  const handleEditPreferencesClose = () => {
    setEditPreferencesOpen(false);
    setEditPreferencesExpanded(false);
  };
  const handleEditPreferencesSaved = () => {
    setEditPreferencesOpen(false);
    setEditPreferencesSnackbarOpen(true);
  };
  const { data: session, isPending } = useSession();
  const user = session?.user;

  return (
    <>
      <AppBar
        position={isTransparent ? "absolute" : "sticky"}
        className={`shadow-none ${
          isTransparent
            ? "bg-transparent bg-gradient-to-b from-black/50 to-black/0"
            : "bg-white dark:bg-[#323235]"
        }`}
        sx={{
          backgroundImage: "none",
          ...(!isTransparent && { borderBottom: 1, borderColor: "divider" }),
        }}
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
              <Typography
                className="font-poppins text-[28px] leading-[24px]"
                fontWeight={700}
                sx={{
                  color:
                    isTransparent && resolvedTheme === "light"
                      ? "white"
                      : "primary.main",
                }}
              >
                PeterPlate
              </Typography>
            </Link>
          </div>

          <nav className="flex-1 flex gap-0 justify-evenly">
            {DESKTOP_TOOLBAR_ELEMENTS.map((element) => {
              if (element.children) {
                return (
                  <ToolbarDropdown
                    key={element.title}
                    element={element}
                    isTransparent={isTransparent}
                    pathname={pathname}
                  />
                );
              }
              return (
                <Button
                  key={element.title}
                  component={Link}
                  href={element.href || "#"}
                  className={`normal-case text-[16px] !font-medium ${
                    isTransparent
                      ? "text-white"
                      : pathname === element.href
                        ? "!text-sky-700 dark:!text-blue-300"
                        : "!text-black dark:!text-white"
                  }`}
                >
                  {element.title}
                </Button>
              );
            })}
          </nav>

          <div className="flex-none flex items-center gap-4">
            <div className="flex-none flex items-center gap-4">
              {isPending ? (
                <GuestToolbarMenu {...{ isTransparent }} disabled />
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
                <GuestToolbarMenu {...{ isTransparent }} />
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
          className:
            "bg-transparent shadow-none p-0 w-[357px] max-h-[658px] mt-1",
        }}
        MenuListProps={{
          className: "p-0",
        }}
      >
        <SidebarContent
          onClose={handleProfileClose}
          onEditPreferencesClick={handleEditPreferencesOpen}
        />
      </Menu>

      {isDesktop ? (
        <Dialog
          open={editPreferencesOpen}
          onClose={handleEditPreferencesClose}
          maxWidth={false}
          PaperProps={{
            className:
              "w-[500px] max-w-[90vw] m-2 p-0 overflow-hidden flex flex-col rounded-[12px] bg-white shadow-[0_4px_20px_0_#6A7282] dark:bg-[#313136] dark:border-[3px] dark:border-[#3F3F47] dark:shadow-none",
            style: {
              height: editPreferencesExpanded ? 593 : 558,
            },
          }}
        >
          <EditPreferencesContent
            onSaved={handleEditPreferencesSaved}
            onExpandChange={setEditPreferencesExpanded}
          />
        </Dialog>
      ) : (
        <Drawer
          anchor="bottom"
          open={editPreferencesOpen}
          onClose={handleEditPreferencesClose}
          slotProps={{
            paper: {
              className:
                "p-0 overflow-hidden rounded-t-[10px] mt-[96px] h-auto max-h-[85vh] flex flex-col min-h-0 bg-white dark:bg-[#313136] dark:border-[3px] dark:border-[#3F3F47] dark:border-b-0 dark:rounded-t-[12px]",
            },
          }}
        >
          <EditPreferencesContent onSaved={handleEditPreferencesSaved} />
        </Drawer>
      )}

      <Snackbar
        open={editPreferencesSnackbarOpen}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setEditPreferencesSnackbarOpen(false);
        }}
        message="Preferences updated successfully"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}

function MobileToolbar(): React.JSX.Element {
  const pathname = usePathname();
  const isTransparent = TRANSPARENT_PAGES.includes(pathname);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const profileOpen = Boolean(profileAnchor);
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [isMounted, setIsMounted] = useState(false);
  const [editPreferencesOpen, setEditPreferencesOpen] = useState(false);
  const [editPreferencesSnackbarOpen, setEditPreferencesSnackbarOpen] =
    useState(false);
  const [_editPreferencesExpanded, setEditPreferencesExpanded] =
    useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleEditPreferencesOpen = () => {
    setProfileAnchor(null);
    setEditPreferencesOpen(true);
  };

  const handleEditPreferencesClose = () => {
    setEditPreferencesOpen(false);
    setEditPreferencesExpanded(false);
  };

  const handleEditPreferencesSaved = () => {
    setEditPreferencesOpen(false);
    setEditPreferencesSnackbarOpen(true);
  };

  const diningHref =
    pathname === "/brandywine"
      ? "/anteatery"
      : pathname === "/anteatery"
        ? "/brandywine"
        : "/brandywine";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/brandywine")
      return pathname === "/brandywine" || pathname === "/anteatery";
    return pathname?.startsWith(href);
  };

  const greeting =
    !isMounted || isPending
      ? "Hi, welcome back!"
      : user
        ? `Hi ${user.name?.split(" ")[0]}, welcome back!`
        : "Hi, welcome back!";

  return (
    <>
      {/* Sticky top header bar */}
      <div
        className={`top-0 z-50 w-full px-4 py-2.5 flex items-center justify-between ${
          isTransparent
            ? "absolute bg-transparent"
            : "sticky bg-white dark:bg-[#27272A]"
        }`}
      >
        <span
          className={`text-[15px] font-semibold truncate pr-2 ${
            isTransparent
              ? "text-white"
              : "text-neutral-800 dark:text-neutral-100"
          }`}
        >
          {greeting}
        </span>
        <div className="flex-shrink-0 min-h-[44px] flex items-center justify-center gap-2">
          {!isMounted || isPending ? (
            <GuestToolbarMenu
              {...{ isTransparent }}
              disabled
              buttonClassName="!min-w-[44px] !min-h-[44px]"
            />
          ) : user ? (
            <IconButton
              type="button"
              onClick={handleProfileOpen}
              className="!p-0 !min-w-[44px] !min-h-[44px]"
              aria-label="Open profile menu"
            >
              <Image
                src={user.image || "/default-avatar.png"}
                alt={user.name || "User profile"}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full"
              />
            </IconButton>
          ) : (
            <GuestToolbarMenu
              {...{ isTransparent }}
              buttonClassName="!min-w-[44px] !min-h-[44px]"
            />
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[520px]">
        <div
          className="
            rounded-[28px]
            px-4 py-3
            shadow-lg
            bg-gradient-to-b from-sky-700 to-sky-900 dark:from-[#8EC5FF] dark:to-[#4281CA]
          "
        >
          <div className="flex items-center justify-between">
            {MOBILE_TOOLBAR_ELEMENTS.map((element) => {
              if (!element.href) return null;

              const isDining = element.title === "Dining";
              const effectiveHref = isDining ? diningHref : element.href;
              const active = isActive(element.href);

              return (
                <Link
                  key={element.title}
                  href={effectiveHref}
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
                    className={active ? "dark:!text-[#162456]" : ""}
                  >
                    {element.icon}
                  </div>
                  <span
                    className={`
                      text-[12px] leading-none text-white
                      ${active ? "font-semibold dark:!text-[#162456]" : "font-medium"}
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
          className:
            "bg-transparent shadow-none p-0 w-[357px] max-h-[658px] mt-1",
        }}
        MenuListProps={{
          className: "p-0",
        }}
      >
        <SidebarContent
          onClose={handleProfileClose}
          onEditPreferencesClick={handleEditPreferencesOpen}
        />
      </Menu>

      <Drawer
        anchor="bottom"
        open={editPreferencesOpen}
        onClose={handleEditPreferencesClose}
        slotProps={{
          paper: {
            className:
              "p-0 overflow-hidden rounded-t-[10px] mt-[96px] h-auto max-h-[85vh] flex flex-col min-h-0 bg-white dark:bg-[#313136] dark:border-[3px] dark:border-[#3F3F47] dark:border-b-0 dark:rounded-t-[12px]",
          },
        }}
      >
        <EditPreferencesContent
          onSaved={handleEditPreferencesSaved}
          onExpandChange={setEditPreferencesExpanded}
        />
      </Drawer>

      <Snackbar
        open={editPreferencesSnackbarOpen}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setEditPreferencesSnackbarOpen(false);
        }}
        message="Preferences updated successfully"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}

export default function AdaptiveToolbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return isDesktop ? <DesktopToolbar /> : <MobileToolbar />;
}
