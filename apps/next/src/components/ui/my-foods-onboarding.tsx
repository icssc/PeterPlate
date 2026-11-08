"use client";

import { type EventData, Joyride, STATUS, type Step } from "react-joyride";
import { useTourStore } from "@/context/useTourStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CustomTooltip } from "./tracker-onboarding";

export default function MyFoodsOnboarding() {
  const running = useTourStore((state) => state.activeTour === "my-foods");
  const launchId = useTourStore((state) => state.launchId);
  const stop = useTourStore((state) => state.stop);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const steps: Step[] = [
    {
      target: isDesktop
        ? "#tour-filter-foods-desktop"
        : "#tour-filter-foods-mobile",
      content: "Filter your rated and favorited foods by dining hall location.",
      title: "Filter by Location",
      skipBeacon: true,
      placement: isDesktop ? "right-start" : "top",
    },
    {
      target: isDesktop
        ? "#tour-search-foods-desktop"
        : "#tour-search-foods-mobile",
      content:
        "Use the search bar to quickly find specific dishes you've rated/favorited.",
      title: "Search Your Foods",
      skipBeacon: true,
      placement: isDesktop ? "bottom" : "top",
    },
    {
      target: isDesktop
        ? "#tour-sort-foods-desktop"
        : "#tour-sort-foods-mobile",
      content:
        "Sort your foods by date modified, rating, or alphabetically to organize your list.",
      title: "Sort Your Foods",
      skipBeacon: true,
      placement: isDesktop ? "left-start" : "top",
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
      steps={steps}
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
