/* =====================================================================
   MSRTC Timetable — service worker

   Why this is a separate file and not inlined in index.html:
   a worker registered from a blob: or data: URL has no usable scope and
   cannot intercept navigation requests. Inlining it would produce an app
   that registers successfully and then serves nothing when the network
   drops — worse than having no worker at all, because it looks like it
   works. The "single-file app" constraint stops at the worker boundary.

   Caching strategy, by resource class:
     app shell (index.html, manifest, icons) — cache-first, revalidated on
       activate via a version bump. The timetable is embedded in the HTML,
       so a cached shell IS a usable offline timetable.
     fonts + Tailwind CDN                    — stale-while-revalidate.
       These are third-party and immutable per URL; serving stale is safe
       and keeps first paint instant.
     everything else                         — network-first with a cache
       fallback.

   Bump CACHE_VERSION on every deploy. Without a bump, returning users keep
   the old timetable indefinitely, which is the classic PWA failure mode.
   ===================================================================== */

const CACHE_VERSION = 'msrtc-v1.1.0';   /* v1.1.0: accessibility release — bump forces shell refresh */
const SHELL_CACHE   = `${CACHE_VERSION}-shell`;
const ASSET_CACHE   = `${CACHE_VERSION}-assets`;

/* Relative paths so the worker survives being deployed to a sub-path
   (e.g. https://host/timetable/) without edits. */
const SHELL = [
  './',
  './index.html',
  './manifest.json'
];

/* Third-party origins that may be served stale. Anything not listed here
   falls through to network-first. */
const SWR_HOSTS = [
  'cdn.tailwindcss.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

/* ---------- install: precache the shell ----------------------------- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      /* addAll is atomic — one 404 rejects the whole install and the old
         worker stays active. That is the behaviour we want: a half-cached
         shell is not a working offline app. */
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

/* ---------- activate: drop caches from previous versions ------------ */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !k.startsWith(CACHE_VERSION))
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ---------- fetch --------------------------------------------------- */
self.addEventListener('fetch', event => {
  const req = event.request;

  /* Only GET is cacheable. POST/PUT go straight to the network. */
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* Navigations: cache-first on the shell. This is what makes the app open
     instantly and work with the radio off — the entire timetable dataset is
     embedded in index.html, so one cached document is the whole product. */
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html', { ignoreSearch: true })
        .then(hit => hit || fetch(req).catch(() =>
          caches.match('./index.html')))
    );
    return;
  }

  /* Fonts and the Tailwind CDN: serve from cache immediately, refresh in
     the background. The user never waits on a third-party origin. */
  if (SWR_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(cache =>
        cache.match(req).then(hit => {
          const net = fetch(req).then(res => {
            /* Opaque cross-origin responses (status 0) are still cacheable
               and still render correctly for fonts and scripts. */
            if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
            return res;
          }).catch(() => hit);
          return hit || net;
        })
      )
    );
    return;
  }

  /* Same-origin assets: network-first so a redeploy is picked up promptly,
     with the cache as the offline fallback. */
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok && url.origin === self.location.origin) {
          const copy = res.clone();
          caches.open(ASSET_CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});

/* ---------- message: allow the page to force an update -------------- */
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
