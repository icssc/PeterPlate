"use client";

import type { AppRouter } from "@api/index";
import { LocationOn } from "@mui/icons-material";
import { Box, Container, Link, Typography } from "@mui/material";
import type { TRPCClientErrorLike } from "@trpc/client";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRestaurantPage } from "@/hooks/useRestaurantPage";
import { cn } from "@/utils/tw";
import {
  ANTEATERY_MAP_LINK_URL,
  BRANDYWINE_MAP_LINK_URL,
  HallEnum,
} from "@/utils/types";
import { DiningHallStatus } from "../status";
import { DishesView } from "./dishes-view";
import { RestaurantControls } from "./restaurant-controls";
import { Sidebar } from "./sidebar";
import RestaurantSpinner from "./spinner";

interface RestaurantPageProps {
  hall: HallEnum;
}

export function RestaurantPage({
  hall,
}: RestaurantPageProps): React.JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    hallData,
    isLoading,
    isError,
    error,
    hallEvents,
    periods,
    activeStation,
    stations,
    dishes,
    calendarRange,
    displayDate,
    openTime,
    closeTime,
    derivedHallStatus,
    availablePeriodTimes,
    selectedDate,
    handleDateSelect,
  } = useRestaurantPage(hall);

  const hero =
    hall === HallEnum.ANTEATERY
      ? { src: "/anteatery.webp", alt: "Anteatery dining hall" }
      : { src: "/brandywine.webp", alt: "Brandywine dining hall" };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero image & mobile header */}
      <div className="relative w-full h-[200px] md:h-[250px]">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          className={cn(
            "object-cover",
            hall === HallEnum.BRANDYWINE && "object-bottom",
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />

        {/* Mobile Header Overlay */}
        {!isDesktop && (
          <div className="absolute bottom-0 left-0 p-4 w-full text-white">
            <div className="flex items-center gap-2">
              <Typography
                variant="h4"
                fontWeight={700}
                className="mb-1 text-white"
              >
                {hall === HallEnum.ANTEATERY ? "Anteatery" : "Brandywine"}
              </Typography>
              <DiningHallStatus status={derivedHallStatus} mobile />
            </div>
            <Link
              href={
                hall === HallEnum.ANTEATERY
                  ? ANTEATERY_MAP_LINK_URL
                  : BRANDYWINE_MAP_LINK_URL
              }
              target="_blank"
              rel="noopener noreferrer"
              className="!text-xs !text-gray-200 flex items-center gap-1 underline-offset-2 !underline !decoration-white"
            >
              <LocationOn className="text-[14px]" />
              {hall === HallEnum.ANTEATERY
                ? "4001 Mesa Rd, Irvine, CA 92617"
                : "Middle Earth Community Irvine, CA 92697"}
            </Link>
          </div>
        )}
      </div>

      {/* Main content container */}
      <Container
        maxWidth={false}
        disableGutters
        className="mt-4 pb-[50px] mx-auto w-full max-w-[1600px] px-2 md:px-8"
      >
        <div className="flex flex-col md:flex-row items-start gap-3">
          {/* Left column: menu controls & dishes */}
          <div className="w-full flex-1 md:min-h-[740px] min-w-0 flex flex-col">
            <RestaurantControls
              hall={hall}
              isDesktop={isDesktop}
              derivedHallStatus={derivedHallStatus}
              periods={periods}
              availablePeriodTimes={availablePeriodTimes}
              selectedDate={selectedDate}
              handleDateSelect={handleDateSelect}
              calendarRange={calendarRange}
              isLoading={isLoading}
              isError={isError}
              dishes={dishes}
              stations={stations}
              hallEvents={hallEvents}
            />

            <div className="w-full">
              <DishesView
                stations={stations}
                activeStation={activeStation}
                isLoading={isLoading}
                isError={isError}
                error={error as TRPCClientErrorLike<AppRouter> | null}
                hallData={hallData}
              />
              {isLoading && <RestaurantSpinner />}
            </div>
          </div>

          {/* Right column: hours & location (desktop only) */}
          {isDesktop && (
            <Sidebar
              displayDate={displayDate}
              periods={periods}
              availablePeriodTimes={availablePeriodTimes}
              hall={hall}
              hallEvents={hallEvents}
            />
          )}
        </div>
      </Container>
    </Box>
  );
}
