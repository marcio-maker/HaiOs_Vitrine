/* HairOS · Service Worker v7
   Correções aplicadas:
   - AbortController no timeout (evita requisições duplicadas)
   - icon-512.png fora do precache (evita 404 silencioso)
   - Cache-first para assets, network-first com timeout para HTML/data.js
*/
const CACHE_NAME = 'hairos-v7';
const ASSETS = [
  './',
  './index.html',
  './assistente.html',
  './data.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(ASSETS.map((a) => cache.add(a)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function guardar(req, res) {
  if (res && res.ok && res.status === 200) {
    const copy = res.clone();
    caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
  }
  return res;
}

function fetchComTimeout(req, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(req, { signal: ctrl.signal })
    .then((res) => { clearTimeout(timer); return res; })
    .catch((err) => { clearTimeout(timer); throw err; });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  const externos = [
    'i.pinimg.com', 'pinimg.com', 'meli.la', 'mercadolivre.com.br',
    'formsubmit.co', 'fonts.googleapis.com', 'fonts.gstatic.com',
    'images.weserv.nl', 'api.qrserver.com', 'cdn.jsdelivr.net'
  ];
  if (externos.some((h) => url.hostname.includes(h))) return;

  const accept = req.headers.get('accept') || '';
  const ehHtml = accept.includes('text/html');
  const ehDados = url.origin === self.location.origin &&
                  url.pathname.endsWith('/data.js');

  if (ehHtml || ehDados) {
    event.respondWith(
      fetchComTimeout(req, 4000)
        .then((res) => guardar(req, res))
        .catch(() =>
          caches.match(req).then((r) => {
            if (r) return r;
            if (ehHtml) return caches.match('./index.html');
            return new Response('', { status: 504, statusText: 'Offline' });
          })
        )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => guardar(req, res)).catch(() => cached);
    })
  );
});