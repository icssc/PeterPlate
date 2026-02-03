"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar as MuiToolbar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { useSession } from "@/utils/auth-client";
import SidebarContent from "./sidebar/sidebar-content";

export type CalendarRange = {
  earliest: Date;
  latest: Date;
};

export default function Toolbar(): React.JSX.Element {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [diningHallsAnchor, setDiningHallsAnchor] = useState<null | HTMLElement>(null);
  const [foodCourtsAnchor, setFoodCourtsAnchor] = useState<null | HTMLElement>(null);

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
        className="!bg-transparent !shadow-none hover:!bg-black/30 !transition-colors !duration-300"
      >
        <MuiToolbar className="justify-between px-4 py-1">
          <div className="flex-none flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                className="rounded-full cursor-pointer"
                src="/Zotmeal-Logo.webp"
                alt="Zotmeal's Logo: a beige anteater with a bushy tail sitting next to an anthill."
                width={40}
                height={40}
              />
              <span className="text-white font-poppins font-bold text-[28px] leading-[24px]">PeterPlate</span>
            </Link>
          </div>

          <nav className="flex-1 flex gap-0 justify-evenly">
            <Button
              onClick={(event: React.MouseEvent<HTMLElement>) => setDiningHallsAnchor(event.currentTarget)}
              endIcon={<ArrowDropDownIcon fontSize="small" />}
              className="!text-white !normal-case !text-[16px] !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
            >
              Dining Halls
            </Button>
            <Menu
              anchorEl={diningHallsAnchor}
              open={Boolean(diningHallsAnchor)}
              onClose={() => setDiningHallsAnchor(null)}
            >
              <MenuItem
                component={Link}
                href="/"
                onClick={() => setDiningHallsAnchor(null)}
              >
                Brandywine
              </MenuItem>
              <MenuItem
                component={Link}
                href="/"
                onClick={() => setDiningHallsAnchor(null)}
              >
                Anteatery
              </MenuItem>
            </Menu>

            <Button
              onClick={(event: React.MouseEvent<HTMLElement>) => setFoodCourtsAnchor(event.currentTarget)}
              endIcon={<ArrowDropDownIcon fontSize="small" />}
              className="!text-white !normal-case !text-[16px] !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
            >
              Food Courts
            </Button>
            <Menu
              anchorEl={foodCourtsAnchor}
              open={Boolean(foodCourtsAnchor)}
              onClose={() => setFoodCourtsAnchor(null)}
            >
              <MenuItem
                component={Link}
                href="/"
                onClick={() => setFoodCourtsAnchor(null)}
              >
                Food court 1
              </MenuItem>
              <MenuItem
                component={Link}
                href="/"
                onClick={() => setFoodCourtsAnchor(null)}
              >
                Food court 2
              </MenuItem>
            </Menu>

            <Button
              component={Link}
              href="/events"
              className="!text-white !normal-case !text-[16px] !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
            >
              Events
            </Button>
            <Button
              component={Link}
              href="/ratings"
              className="!text-white !normal-case !text-[16px] !font-medium hover:!bg-[rgba(0,0,0,0.04)]"
            >
              My Foods
            </Button>
          </nav>

          <div className="flex-none flex items-center gap-4">
            {isPending ? (
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
              <GoogleSignInButton />
            )}
          </div>
        </MuiToolbar>
      </AppBar>

      <SidebarContent open={drawerOpen} onClose={() => setDrawerOpen(!drawerOpen)} />
    </>
  );
}
