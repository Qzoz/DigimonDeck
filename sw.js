const digiCache = 'digiDeck-cache-v1';
const digiAssets = [
  './',
  './index.html',
];

async function returnCatchedData(request) {
    const cache = await caches.open(digiCache);
    const cachedContent = await cache.match(request);
    return cachedContent || returnNetworkData(request);
}

async function returnNetworkData(request, preCached) {
    const cache = await caches.open(digiCache);
    try { 
      const latest = await fetch(request);
      cache.put(request, latest.clone());
      return latest;
    } catch (e) { 
        if (preCached) return preCached;
        const cachedContent = await cache.match(request);
        return cachedContent;
    }
}

self.addEventListener('install', async (event) => {
    const cache = await caches.open(digiCache); 
    await cache.addAll(digiAssets);
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    event.respondWith(returnCatchedData(req));
});
