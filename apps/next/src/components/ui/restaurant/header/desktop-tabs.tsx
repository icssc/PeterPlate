import type { Station } from "@api/index";
import { Tab, Tabs } from "@mui/material";
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

// Scroll a clicked tab out of the edge fade. MUI first scrolls a partly hidden
// tab only to the edge, so wait for that to finish before moving it on.
function scrollPastFade(tab: Element, framesLeft = 60, waited = false) {
  const scroller = tab.closest(".MuiTabs-scroller");
  if (!scroller) return;
  const t = tab.getBoundingClientRect();
  const s = scroller.getBoundingClientRect();
  if (t.left < s.left - 1 || t.right > s.right + 1) {
    if (framesLeft > 0)
      requestAnimationFrame(() => scrollPastFade(tab, framesLeft - 1, true));
    return;
  }
  if (waited) {
    // The tab reaches the edge in MUI's last few frames; let them finish.
    setTimeout(() => scrollPastFade(tab), 100);
    return;
  }
  const delta =
    t.left < s.left + FADE_PX
      ? t.left - s.left - FADE_PX
      : Math.max(0, t.right - s.right + FADE_PX);
  if (delta)
    scroller.scrollTo({
      left: scroller.scrollLeft + delta,
      behavior: "smooth",
    });
}

export function DesktopTabs({
  isDesktop,
  isLoading,
  isError,
  stations,
}: DesktopTabsProps) {
  const selectedStation = useRestaurantUIStore((s) => s.selectedStation);
  const setSelectedStation = useRestaurantUIStore((s) => s.setSelectedStation);

  if (!isDesktop) return null;

  return (
    <div className="mt-3">
      {!isLoading && !isError && stations.length > 0 && (
        <Tabs
          value={selectedStation || false}
          onChange={(event, value: string) => {
            const val = value || "";
            scrollToStation(val);
            setSelectedStation(val);
            scrollPastFade(event.currentTarget);
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
