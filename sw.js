/* HairOS · Service Worker v8
   Correções aplicadas:
   - AbortController no timeout (evita requisições duplicadas)
   - icon-512.png fora do precache (evita 404 silencioso)
   - Cache-first para assets, network-first com timeout para HTML/data.js
   v8:
   - Timeout de 4s só vale se existir cópia em cache (1ª visita em rede lenta não quebra mais)
   - HTML cacheado sem query string (?item=...&ref=...) → sem inchaço do cache
*/
const CACHE_NAME = 'hairos-v8';
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
    // HTML é guardado sem query string; data.js usa a própria requisição
    const chave = ehHtml ? (url.origin + url.pathname) : req;
    event.respondWith(
      caches.match(chave).then((cached) => {
        // Sem cópia local: espera a rede sem abortar. Com cópia: timeout de 4s e cai no cache.
        const rede = cached ? fetchComTimeout(req, 4000) : fetch(req);
        return rede
          .then((res) => guardar(chave, res))
          .catch(() => {
            if (cached) return cached;
            const offline = () => new Response('', { status: 504, statusText: 'Offline' });
            if (ehHtml) return caches.match('./index.html').then((r) => r || offline());
            return offline();
          });
      })
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
