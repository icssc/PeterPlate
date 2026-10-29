"use client";

import { useEffect } from "react";
import { type EventData, Joyride, STATUS, type Step } from "react-joyride";
import { useRestaurantUIStore } from "@/context/useRestaurantUIStore";
import { useTourStore } from "@/context/useTourStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CustomTooltip } from "../tracker-onboarding";

const FOOD_CARD_TARGET = "#food-scroll .MuiCard-root";
// Leaves room below the card for the tooltip instead of scrolling it to the bottom edge
const FOOD_CARD_SCROLL_OFFSET = 250;
const FAVORITE_TARGET = `${FOOD_CARD_TARGET} button[aria-label*="favorites"]`;

export default function RestaurantOnboarding() {
  const running = useTourStore((state) => state.activeTour === "restaurant");
  const launchId = useTourStore((state) => state.launchId);
  const stop = useTourStore((state) => state.stop);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Mobile starts collapsed so the "Expand Filters" step has something to expand
  // biome-ignore lint/correctness/useExhaustiveDependencies: launchId re-collapses the filters every time the tour restarts
  useEffect(() => {
    if (running) useRestaurantUIStore.getState().setIsFiltersExpanded(false);
  }, [running, launchId]);

  const desktopSteps: Step[] = [
    {
      target: "#tour-meal-select",
      content:
        "Choose which meal you want to see: breakfast, lunch, or dinner.",
      title: "Select Meal Type",
      skipBeacon: true,
      placement: "bottom",
    },
    {
      target: "#tour-date-picker",
      content: "Select a date to view a menu for that specific day.",
      title: "Pick a Date",
      skipBeacon: true,
      placement: "bottom",
    },
    {
      target: "#tour-view-toggle-desktop",
      content:
        "Toggle between card or compact view to change how dishes are displayed.",
      title: "Switch Views",
      skipBeacon: true,
      placement: "bottom",
    },
    {
      target: FOOD_CARD_TARGET,
      scrollOffset: FOOD_CARD_SCROLL_OFFSET,
      content:
        "Click the meal card to view its nutrition facts, add it to your meal tracker, or to rate the dish itself.",
      title: "View Food Content",
      skipBeacon: true,
      placement: "right",
    },
    {
      target: FAVORITE_TARGET,
      scrollOffset: FOOD_CARD_SCROLL_OFFSET,
      content:
        "Click the heart button to favorite dishes and see them in your My Foods page.",
      title: "Favorite Dishes",
      skipBeacon: true,
      placement: "right",
    },
    {
      target: "#tour-special-schedules",
      content: "Toggle to see upcoming schedule changes during certain breaks.",
      title: "Special Schedules",
      skipBeacon: true,
      placement: "left",
    },
  ];

  const mobileSteps: Step[] = [
    {
      target: "#tour-switch-hall",
      content:
        "Click here to switch between Brandywine and Anteatery dining halls.",
      title: "Switch Dining Halls",
      skipBeacon: true,
      placement: "bottom",
    },
    {
      target: "#tour-expand-filters",
      content: "Click the three buttons to open up food filters.",
      title: "Expand Filters",
      skipBeacon: true,
      placement: "bottom",
    },
    {
      target: "#tour-filters-mobile",
      content:
        "Use these filter buttons to filter out what foods you would like to see!",
      title: "Filter Foods",
      skipBeacon: true,
      placement: "bottom",
      before: async () => {
        useRestaurantUIStore.getState().setIsFiltersExpanded(true);
      },
    },
    {
      target: FOOD_CARD_TARGET,
      scrollOffset: FOOD_CARD_SCROLL_OFFSET,
      content:
        "Click the meal card to view its nutrition facts, add it to your meal tracker, or to rate the dish itself!",
      title: "View Food Content",
      skipBeacon: true,
      placement: "bottom",
    },
    {
      target: FAVORITE_TARGET,
      scrollOffset: FOOD_CARD_SCROLL_OFFSET,
      content:
        "Click the heart button to favorite dishes and see them in your My Foods page.",
      title: "Favorite Dishes",
      skipBeacon: true,
      placement: "bottom",
    },
  ];

  const handleEvent = ({ status, action }: EventData) => {
    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      action === "close"
    )
      stop();
  };

  if (!running) return null;
  return (
    <Joyride
      key={launchId}
      steps={isDesktop ? desktopSteps : mobileSteps}
      run
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
      tooltipComponent={CustomTooltip}
      options={{
        skipBeacon: true,
        overlayClickAction: false,
        blockTargetInteraction: true,
        zIndex: 1500,
      }}
    />
  );
}
