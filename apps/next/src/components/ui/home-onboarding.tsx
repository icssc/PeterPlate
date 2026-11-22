"use client";

import { useEffect } from "react";
import { type EventData, Joyride, STATUS, type Step } from "react-joyride";
import { useTourStore } from "@/context/useTourStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CustomTooltip } from "./tracker-onboarding";

export default function HomeOnboarding() {
  const running = useTourStore((state) => state.activeTour === "home");
  const launchId = useTourStore((state) => state.launchId);
  const stop = useTourStore((state) => state.stop);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    return () => {
      const { activeTour, stop } = useTourStore.getState();
      if (activeTour === "home") stop();
    };
  }, []);

  const placement = isDesktop ? "bottom-end" : "top";
  const steps: Step[] = [
    {
      target: "#tour-home-dining",
      title: "Switch Dining Halls",
      content: isDesktop
        ? "Click here to switch between Brandywine and Anteatery dining halls."
        : "Tap Dining to view menus, then switch between Brandywine and Anteatery dining halls.",
      placement,
    },
    {
      target: "#tour-home-events",
      title: "Explore Events",
      content: "View upcoming dining hall events and special celebrations.",
      placement,
    },
    {
      target: "#tour-home-my-foods",
      title: "My Foods",
      content:
        "Access all the dishes you've rated and favorited across UCI dining halls.",
      placement,
    },
    {
      target: "#tour-home-tracker",
      title: "Meal Tracker",
      content:
        "Track your daily nutrition and monitor your progress towards your goals.",
      placement,
    },
    {
      target: isDesktop ? "#tour-help-desktop" : "#tour-help-mobile",
      title: "Need this tutorial again?",
      content: isDesktop
        ? "Click the help icon anytime to restart this tutorial!"
        : "Tap the help icon anytime to restart this tutorial!",
      placement: "bottom-end",
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
      key={`${launchId}-${isDesktop}`}
      steps={steps}
      run
      continuous
      onEvent={handleEvent}
      tooltipComponent={CustomTooltip}
      locale={{ last: "Done", skip: "Skip Tour" }}
      floatingOptions={{ hideArrow: true }}
      options={{
        skipBeacon: true,
        skipScroll: true,
        overlayColor: "rgba(0, 0, 0, 0.2)",
        spotlightPadding: 4,
        spotlightRadius: 8,
        overlayClickAction: false,
        blockTargetInteraction: true,
        zIndex: 1500,
      }}
    />
  );
}
