"use client";

import { Close } from "@mui/icons-material";
import {
  type EventData,
  Joyride,
  STATUS,
  type Step,
  type TooltipRenderProps,
} from "react-joyride";
import { useTourStore } from "@/context/useTourStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const CustomTooltip = ({
  index,
  step,
  size,
  tooltipProps,
  primaryProps,
  skipProps,
}: TooltipRenderProps) => {
  return (
    <div
      {...tooltipProps}
      className="bg-white dark:bg-[#323235] p-5 rounded-lg shadow-xl w-72 flex flex-col gap-2 relative"
    >
      <button
        {...skipProps}
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
        {index < size - 1 && (
          <button
            {...skipProps}
            className="text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 px-2 py-1 rounded"
          >
            Skip Tour
          </button>
        )}
        <button
          {...primaryProps}
          className="ml-auto bg-sky-700 dark:bg-blue-300 text-white dark:text-black font-medium text-sm px-4 py-2 rounded-lg"
        >
          {index === size - 1 ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default function TrackerOnboarding() {
  const running = useTourStore((state) => state.activeTour === "nutrition");
  const launchId = useTourStore((state) => state.launchId);
  const stop = useTourStore((state) => state.stop);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const steps: Step[] = [
    {
      target: isDesktop
        ? "#tour-edit-goals-desktop"
        : "#tour-edit-goals-mobile",
      content:
        "Click the edit icon to set your daily nutrition goals for calories, protein, carbs, and fat.",
      title: "Set Your Goals",
      skipBeacon: true,
      placement: isDesktop ? "left-start" : "right",
    },
    {
      target: isDesktop ? "#tour-progress-desktop" : "#tour-progress-mobile",
      content:
        "These widgets show your progress towards your daily nutrition goals.",
      title: "Track Your Progress",
      skipBeacon: true,
      placement: isDesktop ? "bottom" : "bottom-start",
    },
    {
      target: ".tour-suggested-card:first-of-type",
      content:
        "Click the plus button to add the suggested food to your meal tracker.",
      title: "Add Suggested Foods",
      skipBeacon: true,
      placement: isDesktop ? "right-end" : "top-end",
    },
    {
      target: "#tour-fab-search-btn",
      content: "Search and also view more foods to add to your tracker!",
      title: "View More Suggested Foods",
      skipBeacon: true,
      placement: "left-start",
    },
    {
      target: isDesktop ? "#tour-history-desktop" : "#tour-history-mobile",
      content:
        "Click History to view past meal tracker days and track your progress over time.",
      title: "View Your History",
      skipBeacon: true,
      placement: "left-start",
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
      arrowComponent={() => null}
      options={{
        skipBeacon: true,
        overlayClickAction: false,
        blockTargetInteraction: false,
        zIndex: 1500,
        offset: -18,
      }}
    />
  );
}
