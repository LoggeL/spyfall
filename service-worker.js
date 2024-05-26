importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
)

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}

//workbox.setConfig({ debug: true });

workbox.routing.registerRoute(
  // Cache Everything.
  ({ request }) => true,
  new workbox.strategies.StaleWhileRevalidate({})
)
