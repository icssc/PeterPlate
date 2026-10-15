// Push notifications only. No fetch handler on purpose: service workers
// that handle sign-in requests can break login on Safari.

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("push", (event) => {
  if (!event.data) return;

  // Fall back to text: iOS can cancel subscriptions if a push shows nothing.
  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "PeterPlate", body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      data: { url: payload.data?.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "/",
    self.location.origin,
  ).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        const existing = windowClients.find(
          (client) => client.url === targetUrl,
        );
        if (existing) return existing.focus();
        return self.clients.openWindow(targetUrl);
      }),
  );
});
