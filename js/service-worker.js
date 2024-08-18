self.addEventListener("install", (event) => {
	// Skip waiting so that the new service worker activates immediately
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

// Fetch event and other service worker logic
self.addEventListener("fetch", (event) => {
	// Example fetch handler
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});
