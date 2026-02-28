"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
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
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { useState } from "react";
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
};

const TOOLBAR_ELEMENTS: ToolbarElement[] = [
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

function ToolbarDropdown({ element }: { element: ToolbarElement }) {
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

export default function Toolbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const profileOpen = Boolean(profileAnchor);
  const [editPreferencesOpen, setEditPreferencesOpen] = useState(false);
  const [editPreferencesSnackbarOpen, setEditPreferencesSnackbarOpen] =
    useState(false);

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
            {TOOLBAR_ELEMENTS.map((element) => {
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
              "w-[460px] max-w-[90vw] max-h-[90vh] m-2 p-0 overflow-hidden flex flex-col rounded-2xl",
          }}
        >
          <EditPreferencesContent onSaved={handleEditPreferencesSaved} />
        </Dialog>
      ) : (
        <Drawer
          anchor="bottom"
          open={editPreferencesOpen}
          onClose={handleEditPreferencesClose}
          slotProps={{
            paper: {
              sx: {
                padding: 0,
                overflow: "hidden",
                borderRadius: "16px",
              },
            },
          }}
          sx={{
            "& .MuiDrawer-paper": {
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              marginTop: "96px",
              height: "auto",
              maxHeight: "85vh",
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

      {/* <SidebarContent
        open={drawerOpen}
        onClose={() => setDrawerOpen(!drawerOpen)}
      /> */}
    </>
  );
}
