const CACHE_NAME = 'cachev2';

self.addEventListener('install', async event => {
    console.log('install', event);
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
        '/',
        '/favicon.ico',
        '/imgs/logo.png',
        '/manifest.json',
        '/sw.js'
    ])
    // event.waitUntil(self.skipWaiting())
    await self.skipWaiting();
})

self.addEventListener('activate', async event => {
    console.log('activate', event);
    const cachesKeys = await caches.keys();
    const deleteKeys = cachesKeys.filter(key => key !== CACHE_NAME);
    deleteKeys.forEach(key => {
        caches.delete(key);
    })
    // event.waitUntil(self.clients.claim());
    await self.clients.claim();
})


self.addEventListener('fetch', async event => {
    console.log('fetch', event);
    const request = event.request;
    if (request.url.includes('/api/')) {
    console.log(request.url);
        return event.respondWith(networkFirst(request));
    }
    return event.respondWith(cacheFirst(request));
})

async function networkFirst(req) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cached = await cache.match(req);
        return cached;
    }
}

async function cacheFirst(req) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) {
        return cached;
    } else {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    }
}