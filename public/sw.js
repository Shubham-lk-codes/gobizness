const CACHE_NAME = 'topdesign-static-v1';
const APP_SHELL = ['/', '/css/main.min.css', '/js/main.min.js'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => Promise.all(APP_SHELL.map(url => cache.add(url))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(names => Promise.all(names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put('/', copy));
                    return response;
                })
                .catch(() => caches.match('/'))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cached => cached || fetch(request))
    );
});
