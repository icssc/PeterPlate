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

  // ---- 1. NEVER CACHE — auth, tRPC, and user-specific API routes ----
  // Caching auth responses risks serving stale session state or leaking
  // one user's data to another on a shared device.
  // All application data queries go through /api/trpc so we exclude the
  // entire prefix; selective tRPC caching would require inspecting procedure
  // names in the URL which is fragile.
  // ---- 1. NEVER CACHE — auth + user (keep this) ----
if (
  url.pathname.startsWith('/api/auth') ||
  url.pathname.startsWith('/api/user')
) {
  return;
}

// ---- 2. tRPC handling (fine-grained instead of blanket exclusion) ----
if (url.pathname.startsWith('/api/trpc')) {
  const pathParam = url.searchParams.get('path');
  const procedures = pathParam ? pathParam.split(',') : [];

  const hasProc = (prefixes) =>
    procedures.some((p) => prefixes.some((pref) => p.startsWith(pref)));

  // NEVER CACHE (auth-like or mutations)
  if (
    hasProc(['auth.', 'user.', 'preferences.', 'preference.', 'favorite.']) ||
    request.method !== 'GET'
  ) {
    return;
  }

  // CACHE FIRST (nutrition / ingredients)
  if (hasProc(['nutrition.', 'ingredients.'])) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached && isCacheFresh(cached, CACHE_FIRST_MAX_AGE_SECONDS)) {
          return cached;
        }
        return fetchAndCache(request, CACHE_NAME).catch(() => cached);
      })
    );
    return;
  }

  // NETWORK FIRST (ratings / events / status)
  if (hasProc(['ratings.', 'events.', 'status.'])) {
    event.respondWith(
      fetchAndCache(request, CACHE_NAME).catch(() =>
        caches.match(request)
      )
    );
    return;
  }

  // STALE-WHILE-REVALIDATE (restaurants / dishes)
  if (hasProc(['restaurants.', 'dishes.'])) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const networkFetch = fetch(request)
            .then((res) => {
              if (res.ok) cache.put(request, res.clone()).catch(() => {});
              return res;
            })
            .catch(() => null);

          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // DEFAULT fallback for unknown procedures
  event.respondWith(
    fetchAndCache(request, CACHE_NAME).catch(() =>
      caches.match(request)
    )
  );
  return;
}

  // ---- 2. CACHE FIRST — static assets (images, icons, fonts) ----
  // These are content-addressed or versioned by filename so staleness is
  // not a concern. Serve from cache instantly; populate cache on first miss.
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff|woff2|ttf|otf)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetchAndCache(request, CACHE_NAME);
      }),
    );
    return;
  }

  // ---- 3. CACHE FIRST with TTL — nutrition and ingredient data ----
  // This data is relatively static (updated once per day at most).
  // Serve from cache if fresh; otherwise re-fetch and update the cache.
  if (
    url.pathname.includes('/nutrition') ||
    url.pathname.includes('/ingredients')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached && isCacheFresh(cached, CACHE_FIRST_MAX_AGE_SECONDS)) {
          return cached;
        }
        // Cache is missing or stale — fetch and update.
        return fetchAndCache(request, CACHE_NAME).catch(() => {
          // If the network fails and we have a stale copy, return it rather
          // than showing an error — stale nutrition data is better than nothing.
          return cached || caches.match('/offline');
        });
      }),
    );
    return;
  }

  // ---- 4. NETWORK FIRST — ratings and events ----
  // This data changes frequently. Always try the network; fall back to cache
  // only when offline so users see something rather than a blank page.
  if (
    url.pathname.includes('/ratings') ||
    url.pathname.includes('/events')
  ) {
    event.respondWith(
      fetchAndCache(request, CACHE_NAME).catch(
        () => caches.match(request),
      ),
    );
    return;
  }

  // ---- 5. STALE-WHILE-REVALIDATE — restaurant and dish pages ----
  // Return the cached version immediately for speed, but always fire a
  // background fetch to keep the cache fresh for the next visit.
  if (
    url.pathname.startsWith('/anteatery') ||
    url.pathname.startsWith('/brandywine') ||
    url.pathname.includes('/restaurants') ||
    url.pathname.includes('/dishes')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cached) => {
          // Always kick off a background revalidation.
          const networkFetch = fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone()).catch(() => {});
            return res;
          });
          // Return stale immediately if available; otherwise wait for network.
          return cached || networkFetch;
        });
      }),
    );
    return;
  }

  // ---- 6. NEVER CACHE — user-specific pages ----
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

  // ---- 7. DEFAULT — all other pages (network first + offline fallback) ----
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
