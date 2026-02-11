"use client";

import { useEffect, useState } from "react";

/**
 * A custom React hook that listens for changes in a CSS media query.
 *
 * @param {string} query - The CSS media query string to match (e.g., `'(min-width: 768px)'`).
 * @returns {boolean} `true` if the media query currently matches, `false` otherwise.
 *                    During server-side rendering or before the first client-side effect runs,
 *                    it defaults to `false`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure window is defined (for SSR compatibility)
    if (typeof window === "undefined") {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const listener = () => setMatches(mediaQueryList.matches);

    listener();

    // Add an event listener for changes in the media query's matched status.
    mediaQueryList.addEventListener("change", listener);

    // Cleanup function: Remove the event listener when the component unmounts or the query changes.
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
