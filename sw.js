// 176

const assets = [
  './',
  './favicon.ico',
  './manifest.json',
  './Orca/desktop/icon.png',
  './Orca/desktop/sources/links/main.css',
  './Orca/desktop/sources/scripts/lib/acels.js',
  './Orca/desktop/sources/scripts/lib/theme.js',
  './Orca/desktop/sources/scripts/lib/history.js',
  './Orca/desktop/sources/scripts/lib/source.js',
  './Orca/desktop/sources/scripts/core/library.js',
  './Orca/desktop/sources/scripts/core/io.js',
  './Orca/desktop/sources/scripts/core/operator.js',
  './Orca/desktop/sources/scripts/core/orca.js',
  './Orca/desktop/sources/scripts/core/transpose.js',
  './Orca/desktop/sources/scripts/core/io/cc.js',
  './Orca/desktop/sources/scripts/core/io/midi.js',
  './Orca/desktop/sources/scripts/core/io/mono.js',
  './Orca/desktop/sources/scripts/core/io/osc.js',
  './Orca/desktop/sources/scripts/core/io/udp.js',
  './Orca/desktop/sources/scripts/clock.js',
  './Orca/desktop/sources/scripts/commander.js',
  './Orca/desktop/sources/scripts/cursor.js',
  './Orca/desktop/sources/scripts/client.js',
  './scripts//lib/tone.js',
  './scripts/enfer/kit.js',
  './scripts/enfer/knob.js',
  './scripts/enfer/mixer.js',
  './scripts/enfer/rack.js',
  './scripts/orca_play.js'
]

self.addEventListener('install', async function () {
  const cache = await caches.open('Orca')
  assets.forEach(function (asset) {
    cache.add(asset).catch(function () {
      console.error('serviceWorker', 'Cound not cache:', asset)
    })
  })
})

self.addEventListener('fetch', async function (event) {
  const request = event.request
  event.respondWith(cacheFirst(request))
})

async function cacheFirst (request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse === undefined) {
    console.error('serviceWorker', 'Not cached:', request.url)
    return fetch(request)
  }
  return cachedResponse
}
