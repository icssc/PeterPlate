import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/app-data",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
  // gzip-js sends binary request bodies which CDN layers (Cloudflare, etc.)
  // can silently decompress before the request reaches Next.js. The route
  // handler then forwards already-decoded JSON and PostHog rejects it with
  // "invalid GZIP data". Disabling compression sends plain JSON instead.
  disable_compression: true,
});
