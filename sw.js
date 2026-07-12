self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.registration.unregister(),
      caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))),
      self.clients.matchAll({ type: 'window' }).then(clients => clients.forEach(client => client.navigate(client.url)))
    ])
  );
});
