"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar as MuiToolbar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { useSession } from "@/utils/auth-client";
import { useDate } from "@/context/date-context";
import { trpc } from "@/utils/trpc";
import type { DateList } from "../../../../../packages/db/src/schema";
import SidebarContent from "./sidebar/sidebar-content";

export type CalendarRange = {
  earliest: Date;
  latest: Date;
};

export default function Toolbar(): JSX.Element {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [diningHallsAnchor, setDiningHallsAnchor] = useState<null | HTMLElement>(null);
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

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDiningHallsClick = (event: React.MouseEvent<HTMLElement>) => {
    setDiningHallsAnchor(event.currentTarget);
  };

  const handleDiningHallsClose = () => {
    setDiningHallsAnchor(null);
  };

  return (
    <>
      <AppBar
        position="absolute"
        className="!bg-white shadow-none border-b border-[rgba(0,0,0,0.08)]"
      >
        <MuiToolbar className="justify-between px-4 py-2">
          <div className="flex-none flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                className="rounded-full cursor-pointer"
                src="/Zotmeal-Logo.webp"
                alt="Zotmeal's Logo: a beige anteater with a bushy tail sitting next to an anthill."
                width={40}
                height={40}
              />
              <span className="text-sky-700 font-poppins font-bold text-[28px] leading-[24px]">PeterPlate</span>
            </Link>
          </div>

          <nav className="flex-1 flex gap-0 justify-evenly">
            <Button
              onClick={handleDiningHallsClick}
              endIcon={<ArrowDropDownIcon fontSize="small" />}
              className="!text-[#1f2937] !normal-case !text-[16px] !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
            >
              Dining Halls
            </Button>
            <Menu
              anchorEl={diningHallsAnchor}
              open={Boolean(diningHallsAnchor)}
              onClose={handleDiningHallsClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem
                component={Link}
                href="/?hall=brandywine"
                onClick={handleDiningHallsClose}
              >
                Brandywine
              </MenuItem>
              <MenuItem
                component={Link}
                href="/?hall=anteatery"
                onClick={handleDiningHallsClose}
              >
                Anteatery
              </MenuItem>
            </Menu>
            <Button
              component={Link}
              href="/events"
              className="!text-[#1f2937] !normal-case !text-[16px] !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
            >
              Events
            </Button>
            <Button
              component={Link}
              href="/my-favorites"
              className="!text-[#1f2937] !normal-case !text-[16px] !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
            >
              Favorites
            </Button>
            <Button
              component={Link}
              href="/ratings"
              className="!text-[#1f2937] !normal-case !text-[16px] !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
            >
              Ratings
            </Button>
            <Button
              component={Link}
              href="/nutrition"
              className="!text-[#1f2937] !normal-case !text-[16px] !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
            >
              Tracker
            </Button>
          </nav>

          <div className="flex-none flex items-center gap-4">
            {isPending ? (
              <div className="w-10 h-10" />
            ) : user ? (
              <IconButton
                onClick={toggleDrawer}
                className="!p-0"
                aria-label="Open sidebar"
              >
                <img
                  src={user.image || "/default-avatar.png"}
                  alt={user.name || "User profile"}
                  className="w-10 h-10 rounded-full"
                />
              </IconButton>
            ) : (
              <GoogleSignInButton />
            )}
          </div>
        </MuiToolbar>
      </AppBar>

      <SidebarContent open={drawerOpen} onClose={toggleDrawer} />
    </>
  );
}
