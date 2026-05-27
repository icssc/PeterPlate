# PWA Service Worker Optimization Notes

## Issue Scope

Issue #707 asks to research and implement service workers that optimize the
PeterPlate PWA. PR #718 already merged the core caching service worker into
`dev`, so this branch keeps only non-duplicate follow-up work needed for that
implementation to be safer and easier to verify.

## Research References

- Next.js PWA guide: service workers should be registered from client code, and
  the guide uses `updateViaCache: "none"` so the service worker update check is
  not blocked by HTTP cache.
  https://nextjs.org/docs/app/guides/progressive-web-apps
- MDN `updateViaCache`: `none` tells the browser not to consult HTTP cache when
  checking the service worker script or imported worker scripts.
  https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/updateViaCache
- Workbox runtime caching: runtime routes should be selected intentionally, with
  cache-first behavior only for stable assets and network-first/network-only
  behavior where cached responses would be unsafe.
  https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/
- Workbox strategies: `CacheFirst` skips the network on cache hit, while
  network-first behavior is appropriate only when cached data is an acceptable
  fallback.
  https://developer.chrome.com/docs/workbox/modules/workbox-strategies
- `next-pwa` configuration: the plugin can generate service workers, but PR
  #718 implemented `apps/next/public/sw.js` directly. That direct worker is the
  source of truth on `dev` for this follow-up, so `next-pwa` should not also
  generate a worker during `next build`.
  https://github.com/shadowwalker/next-pwa

## Assumptions

- The service worker should reduce repeat network work without serving stale
  authenticated or user-specific data.
- PR #718's committed `apps/next/public/sw.js` is the implementation to improve,
  not replace in this branch.
- `next-pwa` generation is duplicate work after PR #718 because it overwrites
  the committed worker during production builds.
- tRPC/user-specific caching decisions from PR #718 should remain intact unless
  the issue owner asks for a broader cache-policy rewrite.
- Push notification persistence, VAPID management, database changes, and
  manifest/install prompt score work are outside this service-worker
  optimization scope.

## Follow-Up Changes Kept Here

- Add `/offline`, because PR #718 falls back to `caches.match("/offline")` but
  `dev` did not have an offline page.
- Avoid duplicate service-worker registration in `/pwa-test`; the root
  `PWAManager` already registers `/sw.js`.
- Register `/sw.js` with `updateViaCache: "none"` from the shared PWA utility so
  browser update checks do not reuse a cached service-worker script.
- Export the plain Next config instead of wrapping it with `next-pwa`, preventing
  production builds from replacing PR #718's committed service worker.
