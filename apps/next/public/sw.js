// Service Worker for PeterPlate PWA
// Handles caching strategies and push notifications.
//
// NOTE: Service workers are static files and must be plain JS unless a separate
// TS build step is added. This file lives in /public so Next.js serves it at
// the root scope required for service worker registration.

const CACHE_NAME = 'peterplate-v1';

// Critical assets to pre-cache on install so the shell works offline immediately.
const PRECACHE_ASSETS = [
  '/',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-180x180.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
];

// Max age (in seconds) for cache-first responses before they are considered stale.
// Nutrition/ingredient data changes at most once a day, so 24 h is reasonable.
const CACHE_FIRST_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if a cached Response is still within its allowed max age.
 * Falls back to false when the Date header is missing so we re-fetch.
 *
 * @param {Response} response
 * @param {number} maxAgeSeconds
 */
function isCacheFresh(response, maxAgeSeconds) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  const ageMs = Date.now() - new Date(dateHeader).getTime();
  return ageMs < maxAgeSeconds * 1000;
}

/**
 * Fetch a request, store a clone in the named cache, and return the response.
 * Silently swallows cache write errors so a full disk never breaks the fetch.
 *
 * @param {Request} request
 * @param {string} cacheName
 * @returns {Promise<Response>}
 */
async function fetchAndCache(request, cacheName) {
  const response = await fetch(request);
  // Only cache valid, non-opaque responses to avoid storing error pages.
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

// ---------------------------------------------------------------------------
// Install — pre-cache the app shell
// ---------------------------------------------------------------------------

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()), // activate immediately without waiting for old SW to die
  );
});

// ---------------------------------------------------------------------------
// Activate — delete caches from previous versions
// ---------------------------------------------------------------------------

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()), // take control of all open tabs immediately
  );
});

// ---------------------------------------------------------------------------
// Fetch — tiered caching strategies
// ---------------------------------------------------------------------------

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept same-origin GET requests.
  // POST/PUT/DELETE must always hit the network (mutations).
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // ---- tRPC handling — fine-grained per-procedure caching ----
  if (url.pathname.startsWith('/api/trpc')) {
    const pathParam = url.searchParams.get('path');
    const procedures = pathParam ? pathParam.split(',') : [];

    const hasProc = (prefixes) =>
      procedures.some((p) => prefixes.some((pref) => p.startsWith(pref)));

    // NEVER CACHE — mutations and all user-specific data.
    // Caching these risks leaking one user's data to another on a shared device,
    // or showing stale personal state after login/logout.
    if (
      request.method !== 'GET' ||
      hasProc([
        'user.',
        'preference.',
        'favorite.',
        'allergy.',
        'nutrition.',
        'dish.rated',
      ])
    ) {
      return;
    }

    // NETWORK FIRST — aggregate/public data that changes often.
    // Fresh from network when online; cached fallback when offline.
    if (
      hasProc([
        'dish.getAverageRating',
        'event.',
        'peterplate',
        'pickableDates',
        'peterplate_contributors',
      ])
    ) {
      event.respondWith(
        fetchAndCache(request, CACHE_NAME).catch(() => caches.match(request)),
      );
      return;
    }

    // DEFAULT — unknown tRPC procedures (network-first with cache fallback).
    event.respondWith(
      fetchAndCache(request, CACHE_NAME).catch(() => caches.match(request)),
    );
    return;
  }

  // ---- CACHE FIRST — static assets (images, icons, fonts, CSS) ----
  // Content-addressed or versioned by filename, so staleness is not a concern.
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff|woff2|ttf|otf|css)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetchAndCache(request, CACHE_NAME);
      }),
    );
    return;
  }

  // ---- NEVER CACHE — user-specific pages ----
  // These pages render personalised data (favorites, tracked meals, ratings).
  // Caching them risks showing one user's data after they log out or on a
  // shared device. Always fetch from network; fall back to offline page only.
  if (
    url.pathname.startsWith('/my-favorites') ||
    url.pathname.startsWith('/my-foods') ||
    url.pathname.startsWith('/nutrition')
  ) {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline')),
    );
    return;
  }

  // ---- DEFAULT — all other pages (network first + offline fallback) ----
  // Covers the home page, about, pwa-test, etc.
  // Cache a copy on each successful load so the page is available offline.
  event.respondWith(
    fetchAndCache(request, CACHE_NAME).catch(async () => {
      const cached = await caches.match(request);
      return cached || caches.match('/offline');
    }),
  );
});

// ---------------------------------------------------------------------------
// Push notifications
// ---------------------------------------------------------------------------

self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || '1',
      url: data.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    // Focus an existing tab at the target URL if one is open, otherwise open a new one.
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        const existing = windowClients.find((c) => c.url === targetUrl);
        if (existing) return existing.focus();
        return clients.openWindow(targetUrl);
      }),
  );
});
