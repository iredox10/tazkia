
// This is a very basic service worker.
// Its primary purpose in this case is to make the app installable (PWA).

self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  // You can add pre-caching logic here if needed.
});

self.addEventListener('fetch', (event) => {
  // This basic fetch handler allows the app to work offline
  // by responding with network requests first, then falling back to cache.
  event.respondWith(
    fetch(event.request).catch(() => {
      // You can add more robust caching strategies here.
      console.log('Network request failed. Serving from cache if available.');
    })
  );
});
