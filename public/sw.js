// Cache version — bump this any time you deploy updated assets.
// Changing this value forces every browser to discard its old cache
// and install this new service worker immediately.
const CACHE_NAME = 'gobizness-static-v4';
const APP_SHELL = ['/', '/css/hero-animation.css', '/js/site.js', '/js/hero-animation.js'];

self.addEventListener('install', event => {
    // skipWaiting makes this SW take control immediately without waiting
    // for all tabs to close — critical so the new site.js is served right away.
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => Promise.all(APP_SHELL.map(url =>
                // Bust any HTTP cache on the initial fetch during install
                fetch(url, { cache: 'no-store' })
                    .then(resp => cache.put(url, resp))
                    .catch(() => {/* non-fatal — page still works without cache */})
            )))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            // Delete every cache that isn't the current version
            .then(names => Promise.all(
                names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
            ))
            // Immediately take control of all open tabs
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // 1. Non-GET requests (POST, form submissions) — never intercept
    if (request.method !== 'GET') return;

    // 2. API calls — always go straight to the network, no SW involvement
    //    This is the most important rule: the /api/contact fetch MUST reach
    //    the Express server without any service worker interference.
    if (url.pathname.startsWith('/api/')) return;

    // 3. Cross-origin requests (CDN fonts, scripts) — let the browser handle them
    if (url.origin !== self.location.origin) return;

    // 4. JS and CSS — network-first so rebuilds are picked up without a cache bust.
    //    Falls back to the cached version only when completely offline.
    if (url.pathname.startsWith('/js/') || url.pathname.startsWith('/css/')) {
        event.respondWith(
            fetch(request, { cache: 'no-cache' })
                .then(response => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // 5. HTML navigation — network-first, fall back to cached shell when offline
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request, { cache: 'no-cache' })
                .then(response => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put('/', copy));
                    }
                    return response;
                })
                .catch(() => caches.match('/'))
        );
        return;
    }

    // 6. Everything else (images, fonts) — cache-first for performance
    event.respondWith(
        caches.match(request).then(cached => cached || fetch(request))
    );
});
