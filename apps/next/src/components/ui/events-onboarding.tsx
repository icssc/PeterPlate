"use client";

import { type EventData, Joyride, STATUS, type Step } from "react-joyride";
import { useTourStore } from "@/context/useTourStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CustomTooltip } from "./tracker-onboarding";

const gridSteps: Step[] = [
  {
    target: "#tour-events-view-toggle",
    content:
      "Toggle between grid and calendar view to see events in your preferred layout.",
    title: "Switch Views",
    skipBeacon: true,
    placement: "right",
  },
  {
    target: "#tour-events-filters",
    content:
      "Use event type and location filters to find exactly what you're looking for!",
    title: "Filter Events",
    skipBeacon: true,
    placement: "bottom",
  },
];

const calendarSteps: Step[] = [
  {
    // Open it for the first visible day with an event
    target: ".tour-event-day",
    content:
      "Click on any day with events to see more information with event details.",
    title: "Click for Details",
    skipBeacon: true,
    placement: "right",
  },
];

// Override the Joyride scroll, which puts the target at the top of the page
// It was causing a visual bug, so instead I'm scrolling the element into view
// manually before showing the tooltip
const withDesktopScroll = (steps: Step[]): Step[] =>
  steps.map((step) => ({
    ...step,
    skipScroll: true,
    before: async () => {
      document
        .querySelector(step.target as string)
        ?.scrollIntoView({ block: "center" });
    },
  }));

const desktopGridSteps = withDesktopScroll(gridSteps);
const desktopCalendarSteps = withDesktopScroll(calendarSteps);

// Keeps targets below the fixed mobile toolbar when Joyride scrolls to them
const MOBILE_SCROLL_OFFSET = 80;

// Mobile has a list view in place of the grid, so it gets the grid tour
const mobileListSteps: Step[] = [
  {
    ...gridSteps[1],
    target: "#tour-events-location-mobile",
    content: "Use the location filter to find exactly what you're looking for!",
    title: "Filter Events by Location",
    scrollOffset: MOBILE_SCROLL_OFFSET,
  },
  {
    ...gridSteps[0],
    target: "#tour-events-view-toggle-mobile",
    content:
      "Toggle between calendar and list view to see events in your preferred layout.",
    scrollOffset: MOBILE_SCROLL_OFFSET,
    placement: "bottom",
  },
];

const mobileCalendarSteps: Step[] = [
  ...mobileListSteps,
  {
    ...calendarSteps[0],
    scrollOffset: MOBILE_SCROLL_OFFSET,
    placement: "bottom",
  },
];

interface EventsOnboardingProps {
  viewMode: "grid" | "calendar" | "list";
}

export default function EventsOnboarding({ viewMode }: EventsOnboardingProps) {
  const running = useTourStore((state) => state.activeTour === "events");
  const launchId = useTourStore((state) => state.launchId);
  const stop = useTourStore((state) => state.stop);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
      // Switching views mid-tour swaps the step list and so it restarts from step 1
      key={`${launchId}-${viewMode}`}
      steps={
        viewMode === "calendar"
          ? isDesktop
            ? desktopCalendarSteps
            : mobileCalendarSteps
          : isDesktop
            ? desktopGridSteps
            : mobileListSteps
      }
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
