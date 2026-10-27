"use client";

import { useEffect, useState } from "react";

/**
 * Returns how solid the 64px toolbar should be, from 0 to 1, as the page's
 * `#hero` image scrolls under it. It fades in over the image's last 64px.
 */
export function useHeroFade(enabled: boolean): number {
  const [fade, setFade] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const update = () => {
      const heroBottom =
        document.getElementById("hero")?.getBoundingClientRect().bottom ?? 0;
      setFade(Math.min(Math.max((128 - heroBottom) / 64, 0), 1));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [enabled]);

  return fade;
}
