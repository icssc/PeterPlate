"use client";

import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  type CallBackProps,
  Joyride,
  STATUS,
  type Step,
  type TooltipRenderProps,
} from "react-joyride";

const steps: Step[] = [
  {
    target: "#tour-edit-goals",
    content:
      "Click the edit icon to set your daily nutrition goals for calories, protein, carbs, and fat.",
    title: "Set Your Goals",
    disableBeacon: true,
    placement: "left",
  },
  {
    target: ".tour-progress-widgets",
    content:
      "These widgets show your progress towards your daily nutrition goals.",
    title: "Track Your Progress",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: ".tour-suggested-card:first-of-type",
    content:
      "Click the plus button to add the suggested food to your meal tracker.",
    title: "Add Suggested Foods",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: "#tour-fab-search-btn",
    content: "Search and also view more foods to add to your tracker!",
    title: "View More Suggested Foods",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: "#tour-history-btn",
    content:
      "Click History to view past meal tracker days and track your progress over time.",
    title: "View Your History",
    disableBeacon: true,
    placement: "bottom",
  },
];

const CustomTooltip = ({
  index,
  step,
  size,
  tooltipProps,
  primaryProps,
  skipProps,
  backProps,
  closeProps,
}: TooltipRenderProps) => {
  return (
    <div
      {...tooltipProps}
      className="bg-white dark:bg-[#323235] p-5 rounded-lg shadow-xl w-72 flex flex-col gap-2 relative"
    >
      <button
        {...closeProps}
        className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        aria-label="Close"
      >
        <Close fontSize="small" />
      </button>

      <div className="text-xs text-zinc-500 font-medium tracking-wide uppercase">
        {index + 1} of {size}
      </div>

      <div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          {step.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {step.content}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <button
          {...skipProps}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 px-2 py-1 rounded"
        >
          Skip Tour
        </button>
        <button
          {...primaryProps}
          className="bg-sky-700 hover:bg-sky-800 text-white font-medium text-sm px-4 py-2 rounded-lg"
        >
          {index === size - 1 ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default function TrackerOnboarding() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // DEBUG: Always run tour for debugging. Revert to localStorage check later.
    // const hasSeenTour = localStorage.getItem("hasSeenTrackerTour");
    const hasSeenTour = false; // forced false to always trigger
    if (!hasSeenTour) {
      // Add a slight delay so DOM renders before tour starts
      const timer = setTimeout(() => {
        setRun(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      // localStorage.setItem("hasSeenTrackerTour", "true"); // disabled for debugging
    }
  };

  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep={false}
      disableOverlayClose={false}
      showProgress={false}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      styles={{
        options: {
          zIndex: 10000,
        },
        spotlight: {
          borderradius: 8,
        },
      }}
    />
  );
}
