/* Bela Cookie - service worker.
   Para publicar ícones ou versão nova do app: aumente VERSAO e o ?v= dos arquivos
   (aqui, no index.html e no manifest.webmanifest). O cache antigo é apagado sozinho. */
const VERSAO = 'v2';
const CACHE = 'bela-cookie-' + VERSAO;
const CACHE_EXTERNO = 'bela-cookie-externo';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.webmanifest?v=2',
  './icons/apple-touch-icon.png?v=2',
  './icons/icon-192.png?v=2',
  './icons/icon-512.png?v=2',
  './icons/icon-maskable-512.png?v=2',
  './icons/favicon-32.png?v=2',
  './icons/favicon-48.png?v=2'
];
const GERADOR_PDF = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
const HOSTS_EXTERNOS = ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ARQUIVOS.map((u) => new Request(u, { cache: 'reload' })));
    try {
      const ext = await caches.open(CACHE_EXTERNO);
      if (!(await ext.match(GERADOR_PDF))) {
        const res = await fetch(GERADOR_PDF, { mode: 'cors' });
        if (res.ok) await ext.put(GERADOR_PDF, res);
      }
    } catch (_) { /* sem internet agora: o recibo baixa o gerador na primeira vez que for usado */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const nome of await caches.keys()) {
      if (nome.startsWith('bela-cookie-') && nome !== CACHE && nome !== CACHE_EXTERNO) await caches.delete(nome);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  const raiz = new URL('./', self.registration.scope).pathname;

  // Página do app: internet primeiro (pega a versão nova), cópia guardada quando offline.
  if (req.mode === 'navigate' && url.origin === self.location.origin && (url.pathname === raiz || url.pathname === raiz + 'index.html')) {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res.ok) { const cache = await caches.open(CACHE); await cache.put('./index.html', res.clone()); }
        return res;
      } catch (_) {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Ícones e manifesto (versionados com ?v=): cache primeiro.
  if (url.origin === self.location.origin && url.searchParams.has('v')) {
    event.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) { const cache = await caches.open(CACHE); await cache.put(req, res.clone()); }
      return res;
    })());
    return;
  }

  // Fontes e gerador de PDF: usa a cópia guardada e atualiza em segundo plano.
  if (HOSTS_EXTERNOS.includes(url.hostname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_EXTERNO);
      const hit = await cache.match(req, { ignoreVary: true });
      const rede = fetch(req).then(async (res) => {
        if (res.ok || res.type === 'opaque') await cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      if (hit) { event.waitUntil(rede); return hit; }
      return (await rede) || Response.error();
    })());
  }
});
