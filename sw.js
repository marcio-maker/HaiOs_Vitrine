/* HairOS · Service Worker v4 */
const CACHE_NAME = 'hairos-v4';
const ASSETS = [
  './',
  './index.html',
  './assistente.html',
  './data.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png',
  // CDN do QRCode (usado no index.html)
  'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js'
];

self.addEventListener('install', (event) => {
  // Item por item: um 404 (ex.: ícone faltando) não impede o cache dos demais
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
  // só guarda respostas completas e válidas (evita 404/206 no cache)
  if (res && res.ok && res.status === 200) {
    const copy = res.clone();
    caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
  }
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Não intercepta Pinterest / Mercado Livre / FormSubmit / Google Fonts / weserv
  const externos = [
    'i.pinimg.com',
    'pinimg.com',
    'meli.la',
    'mercadolivre.com.br',
    'formsubmit.co',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'images.weserv.nl'
  ];
  if (externos.some((h) => url.hostname.includes(h))) return;

  const accept = req.headers.get('accept') || '';
  const ehHtml = accept.includes('text/html');
  const ehDados = url.origin === self.location.origin && url.pathname.endsWith('/data.js');

  // HTML e data.js: network-first (catálogo atualizado chega sem depender de bump de versão)
  if (ehHtml || ehDados) {
    event.respondWith(
      fetch(req)
        .then((res) => guardar(req, res))
        .catch(() =>
          caches.match(req).then((r) => r || (ehHtml ? caches.match('./index.html') : undefined))
        )
    );
    return;
  }

  // Outros assets: cache-first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => guardar(req, res)))
  );
});
