// Guarda o app no celular para abrir sem internet.
// Ao publicar uma versão nova, troque o número abaixo.
const CACHE = "rotinas-v2";
const ARQUIVOS = [
  "./", "index.html", "manifest.webmanifest",
  "lib/jspdf.umd.min.js", "lib/html2canvas.min.js",
  "fonts/questrial.woff2", "fonts/marcellus.woff2",
  "img/logo-azul.png", "img/logo-dourado.png",
  "img/icone-192.png", "img/icone-512.png", "img/icone-maskable-512.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Tenta a internet primeiro (pega atualizações); sem internet, usa a cópia guardada
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
