"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { useSession } from "@/utils/auth-client";
import SidebarContent from "./sidebar/sidebar-content";
import MenuIcon from "@mui/icons-material/Menu"

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
        className="!capitalize !text-[16px] !font-medium
        group-hover:!text-white !text-white/60 !bg-transparent"
      >
        {element.title}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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

export default function Toolbar(): React.JSX.Element {
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  // const { selectedDate, setSelectedDate } = useDate();
  // const [enabledDates, setEnabledDates] = useState<DateList>([new Date()]);
  // const [calendarRange, setCalendarRange] = useState<CalendarRange>({
  //   earliest: new Date(),
  //   latest: new Date(),
  // });

  // const { data: dateRes } = trpc.pickableDates.useQuery();

  // useEffect(() => {  ---  MOVED TO RESTAURANT PAGE
  //   if (dateRes) {
  //     console.log("Pickable Dates (Front):", dateRes);
  //     setEnabledDates(dateRes);
  //     setCalendarRange({
  //       earliest: dateRes[0],
  //       latest: dateRes[dateRes.length - 1],
  //     });
  //   }
  // }, [dateRes]);

  // const handleDateSelect = (newDateFromPicker: Date | undefined) => {
  //   if (newDateFromPicker) {
  //     const today = new Date();
  //     if (
  //       newDateFromPicker.getFullYear() === today.getFullYear() &&
  //       newDateFromPicker.getMonth() === today.getMonth() &&
  //       newDateFromPicker.getDate() === today.getDate()
  //     ) {
  //       setSelectedDate(new Date());
  //     } else {
  //       setSelectedDate(newDateFromPicker);
  //     }
  //   } else {
  //     setSelectedDate(undefined);
  //   }
  // };

  return (
    <>
      <AppBar
        position="absolute"
        className="!bg-transparent !shadow-none 
        hover:!bg-gradient-to-b !from-black/50 !to-black/0"
      >
        <MuiToolbar className="justify-between px-4 py-1 group">
          <div className="flex-none flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                className="rounded-full cursor-pointer"
                src="/Zotmeal-Logo.webp"
                alt="Zotmeal's Logo: a beige anteater with a bushy tail sitting next to an anthill."
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
                  className="group-hover:!text-white !normal-case !text-[16px] 
                  !font-medium !text-white/60"
                >
                  {element.title}
                </Button>
              );
            })}
          </nav>

          <div className="flex-none flex items-center gap-4">
            {/* {isPending ? (
              <div className="w-10 h-10" />
            ) : user ? (
              <IconButton
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="!p-0"
                aria-label="Open sidebar"
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
              <p></p>
            )} */}
            <div className="flex-none flex items-center gap-4">
                         {isPending ? (
                            <>
                                <div className="w-24 h-5" />
                                <IconButton
                                    className="!text-[#1f2937] hover:!bg-[rgba(0,0,0,0.04)]"
                                    aria-label="Open sidebar"
                                    disabled
                                >
                                    <MenuIcon />
                                </IconButton>
                            </>
                        ) : 
                        user ? (
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
                        )
                        // user ? (
                        //     <>
                        //         <span className="text-sm text-gray-800 font-medium">
                                    // {user.name || user.email || "User"}
                        //         </span>
                        //         <IconButton
                        //             onClick={handleProfileOpen}
                        //             className="!text-[#1f2937] hover:!bg-[rgba(0,0,0,0.04)]"
                        //             aria-label="Open sidebar"
                        //         >
                        //             <MenuIcon />
                        //         </IconButton>
                        //     </>
                         : (
                            <div className="flex items-center gap-2">
                                <GoogleSignInButton />
                                <IconButton
                                    onClick={handleProfileOpen}
                                    className="!text-[#1f2937] hover:!bg-[rgba(0,0,0,0.04)]"
                                    aria-label="Open sidebar"
                                >
                                    <MenuIcon />
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
                        padding: 0
                    },
                }}
                >
                <SidebarContent onClose={handleProfileClose} />
          </Menu>

      {/* <SidebarContent
        open={drawerOpen}
        onClose={() => setDrawerOpen(!drawerOpen)}
      /> */}
    </>
  );
}
