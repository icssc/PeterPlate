import type { Station } from "@api/index";
import { Tab, Tabs } from "@mui/material";
import { useRef } from "react";
import { useRestaurantUIStore } from "@/context/useRestaurantUIStore";
import { scrollToStation, toTitleCase } from "@/utils/funcs";

interface DesktopTabsProps {
  isDesktop: boolean;
  isLoading: boolean;
  isError: boolean;
  stations: Station[];
}

// Width of the edge fade set in the Tabs className.
const FADE_PX = 40;

// Scroll a clicked tab out of the edge fade, selecting it once it is fully in
// view. Selecting a cut-off tab makes MUI first scroll it only to the edge.
// Returns a function that cancels the pending selection.
function scrollPastFade(tab: Element, select: () => void) {
  const scroller = tab.closest(".MuiTabs-scroller");
  if (!scroller) {
    select();
    return () => {};
  }
  // How far the tab sticks out past each side of the scroller.
  const overhang = () => {
    const tabRect = tab.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    return {
      left: scrollerRect.left - tabRect.left,
      right: tabRect.right - scrollerRect.right,
    };
  };
  const { left, right } = overhang();
  const target = Math.min(
    Math.max(
      0,
      scroller.scrollLeft +
        (left > -FADE_PX ? -left - FADE_PX : Math.max(0, right + FADE_PX)),
    ),
    scroller.scrollWidth - scroller.clientWidth,
  );
  scroller.scrollTo({ left: target, behavior: "smooth" });

  let frame = 0;
  let framesLeft = 60;
  const selectInView = () => {
    const { left, right } = overhang();
    if (
      (left <= 0 && right <= 0) ||
      Math.abs(scroller.scrollLeft - target) < 1 ||
      framesLeft-- === 0
    )
      select();
    else frame = requestAnimationFrame(selectInView);
  };
  selectInView();
  return () => cancelAnimationFrame(frame);
}

export function DesktopTabs({
  isDesktop,
  isLoading,
  isError,
  stations,
}: DesktopTabsProps) {
  const selectedStation = useRestaurantUIStore((s) => s.selectedStation);
  const setSelectedStation = useRestaurantUIStore((s) => s.setSelectedStation);
  const cancelSelect = useRef<() => void>(undefined);

  if (!isDesktop) return null;

  return (
    <div className="mt-3">
      {!isLoading && !isError && stations.length > 0 && (
        <Tabs
          value={selectedStation || false}
          onChange={(event, value: string) => {
            const val = value || "";
            scrollToStation(val);
            cancelSelect.current?.();
            cancelSelect.current = scrollPastFade(event.currentTarget, () =>
              setSelectedStation(val),
            );
          }}
          variant="scrollable"
          scrollButtons
          className="h-[42px] min-h-0 w-full rounded-md bg-primary-accent/20 dark:bg-[var(--desktop-tabs-bg)] [&_.MuiTabs-flexContainer]:h-full [&_.MuiTabs-flexContainer]:justify-between [&_.MuiTabs-indicator]:!bg-[var(--primary-accent-hex)] dark:[&_.MuiTabs-indicator]:!bg-[var(--primary-accent-light)] [&_.MuiTabScrollButton-root]:!text-black dark:[&_.MuiTabScrollButton-root]:!text-slate-300 [&_.MuiTabScrollButton-root.Mui-disabled]:!opacity-[0.26] [&_.MuiTabs-scroller]:[mask-image:linear-gradient(to_right,transparent,black_var(--fade-l,0px),black_calc(100%_-_var(--fade-r,0px)),transparent)] [&_.MuiTabScrollButton-root:not(.Mui-disabled)~.MuiTabs-scroller]:[--fade-l:40px] [&_.MuiTabs-scroller:has(+.MuiTabScrollButton-root:not(.Mui-disabled))]:[--fade-r:40px]"
        >
          {stations.map((station) => (
            <Tab
              key={station.name}
              value={station.name.toLowerCase()}
              label={toTitleCase(station.name)}
              className="!whitespace-nowrap !max-w-none !min-w-0 !px-3 !tracking-[0.4px] !font-medium !text-black dark:!text-white !normal-case !min-h-0 aria-selected:!font-semibold aria-selected:!text-[var(--primary-accent-hex)] dark:aria-selected:!text-[var(--primary-accent-light)]"
            />
          ))}
        </Tabs>
      )}
    </div>
  );
}
