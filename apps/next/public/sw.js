// Service Worker for PeterPlate PWA
// It handles push notifications
// But not implemented yet as mentioned in the instructions

// NOTE: I followed the PWA guide which uses JS (swa.js) instead of TS. Service workers are static files, so they must be plain JS unless we add a separate TS build step.

self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json()
        const options = {
            body: data.body,
            icon: data.icon || '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2',
            },
        }
        event.waitUntil(self.registration.showNotification(data.title, options))
    }
})

self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received.')
    event.notification.close()
    event.waitUntil(clients.openWindow('/'))
})

function askForNotificationPermission() {
    if (Notification.permission === 'granted') return;

    Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
            alert("You will not receive notifications from PeterPlate");
        }
    });
}

async function triggerLocalNotification() {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification('Hello!', {
        body: 'This is a local test notification.',
        icon: '/icons/icon-192x192.png'
    });
}