/* Enhanced service worker with versioning + stale-while-revalidate */
const SW_VERSION = 'v2.0.0';
const STATIC_CACHE = `portfolio-static-${SW_VERSION}`;
const RUNTIME_CACHE = `portfolio-runtime-${SW_VERSION}`;
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(STATIC_CACHE);
        await Promise.all(CORE_ASSETS.map(async a => {
            try {
                const r = await fetch(a, {cache: 'reload'});
                if (r.ok) await cache.put(a, r.clone());
            } catch (e) { /* ignore missing */
            }
        }));
        self.skipWaiting();
        self.clients.matchAll({includeUncontrolled: true, type: 'window'}).then(clients => {
            clients.forEach(client => client.postMessage({type: 'SW_INSTALLED', version: SW_VERSION}));
        });
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(k => ![STATIC_CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim())
    );
});

// Helper: Create response with cache headers
function createCachedResponse(response, maxAge = 31536000) {
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', `public, max-age=${maxAge}, immutable`);
    headers.set('Expires', new Date(Date.now() + maxAge * 1000).toUTCString());
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
    });
}

// Helper: stale-while-revalidate with long cache lifetime
async function staleWhileRevalidate(request, cacheName, maxAge = 31536000) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    // Return cached immediately if available
    if (cached) {
        // Revalidate in background
        fetch(request).then(resp => {
            if (resp && resp.status === 200) {
                cache.put(request, createCachedResponse(resp, maxAge));
            }
        }).catch(() => {});
        return cached;
    }
    
    // Fetch and cache with long TTL
    const fetchPromise = fetch(request).then(resp => {
        if (resp && resp.status === 200) {
            const cachedResp = createCachedResponse(resp, maxAge);
            cache.put(request, cachedResp.clone());
            return cachedResp;
        }
        return resp;
    }).catch(() => cached);
    
    return fetchPromise;
}

self.addEventListener('fetch', (event) => {
    const {request} = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);

    // Navigation requests: network first with fallback
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).then(resp => {
                const copy = resp.clone();
                caches.open(STATIC_CACHE).then(cache => cache.put(request, copy));
                return resp;
            }).catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
        );
        return;
    }

    // Same-origin static assets (css/js/media) => stale-while-revalidate with long cache
    if (url.origin === location.origin) {
        // Static assets (JS, CSS, images) - cache for 1 year
        if (/\.(?:js|css|png|jpg|jpeg|svg|gif|webp|ico)$/.test(url.pathname)) {
            // Extract filename to check if it's a hashed asset (immutable)
            const isHashedAsset = /[a-f0-9]{8,}\.(?:js|css)$/i.test(url.pathname) || 
                                  /\/static\//.test(url.pathname);
            const maxAge = isHashedAsset ? 31536000 : 86400; // 1 year for hashed, 1 day for others
            event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, maxAge));
            return;
        }
    }

    // Default: try cache, then network
    event.respondWith(
        caches.match(request).then(cached => cached || fetch(request).catch(() => cached))
    );
});

// Listen for skipWaiting message
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
