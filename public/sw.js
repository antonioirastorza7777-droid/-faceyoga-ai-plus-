const CACHE_NAME = 'faceyoga-ai-plus-v1';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;
const IMAGE_CACHE = `${CACHE_NAME}-images`;

// URLs to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Cache strategies
const cacheStrategies = {
  static: 'cache-first',
  dynamic: 'network-first',
  images: 'cache-first'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== IMAGE_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different request types
  if (request.method === 'GET') {
    // Static assets - cache first
    if (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith('/_next/static/')) {
      event.respondWith(handleStaticRequest(request));
    }
    // Images - cache first with expiration
    else if (request.headers.get('Accept')?.includes('image/') || url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
      event.respondWith(handleImageRequest(request));
    }
    // API calls - network first with cache fallback
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(handleApiRequest(request));
    }
    // Other requests - network first
    else {
      event.respondWith(handleDynamicRequest(request));
    }
  }
});

// Handle static requests (cache first)
async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Static request failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Handle image requests (cache first with expiration)
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Check if cached image is still valid (less than 7 days old)
      const cachedDate = new Date(cachedResponse.headers.get('date') || '');
      const now = new Date();
      const daysDiff = (now - cachedDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff < 7) {
        return cachedResponse;
      }
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, responseToCache);
    }
    return networkResponse;
  } catch (error) {
    console.error('Image request failed:', error);
    // Return a placeholder image or cached version
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Image not available', { status: 404 });
  }
}

// Handle API requests (network first with cache fallback)
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful GET requests
      if (request.method === 'GET') {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
  } catch (error) {
    console.error('API request failed:', error);
    // Try to return cached response for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    return new Response(JSON.stringify({ error: 'Network error', offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle dynamic requests (network first)
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful HTML and JS responses
      const contentType = networkResponse.headers.get('content-type');
      if (contentType && (contentType.includes('text/html') || contentType.includes('application/javascript'))) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
  } catch (error) {
    console.error('Dynamic request failed:', error);
    // Try to return cached response
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'sync-exercise-data') {
    event.waitUntil(syncExerciseData());
  } else if (event.tag === 'sync-progress-data') {
    event.waitUntil(syncProgressData());
  }
});

// Sync exercise data when back online
async function syncExerciseData() {
  try {
    // Get stored exercise data from IndexedDB
    const storedData = await getStoredExerciseData();
    
    // Sync with server
    for (const data of storedData) {
      try {
        const response = await fetch('/api/exercise/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          // Remove synced data from storage
          await removeStoredExerciseData(data.id);
        }
      } catch (error) {
        console.error('Failed to sync exercise data:', error);
      }
    }
  } catch (error) {
    console.error('Exercise sync failed:', error);
  }
}

// Sync progress data when back online
async function syncProgressData() {
  try {
    // Get stored progress data from IndexedDB
    const storedData = await getStoredProgressData();
    
    // Sync with server
    for (const data of storedData) {
      try {
        const response = await fetch('/api/progress/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          // Remove synced data from storage
          await removeStoredProgressData(data.id);
        }
      } catch (error) {
        console.error('Failed to sync progress data:', error);
      }
    }
  } catch (error) {
    console.error('Progress sync failed:', error);
  }
}

// Helper functions for IndexedDB operations (simplified)
async function getStoredExerciseData() {
  // In a real implementation, this would interact with IndexedDB
  return [];
}

async function removeStoredExerciseData(id) {
  // Remove from IndexedDB
  console.log('Removing stored exercise data:', id);
}

async function getStoredProgressData() {
  // In a real implementation, this would interact with IndexedDB
  return [];
}

async function removeStoredProgressData(id) {
  // Remove from IndexedDB
  console.log('Removing stored progress data:', id);
}

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de FaceYoga AI+',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explorar',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('FaceYoga AI+', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('https://faceyoga-ai.app')
    );
  }
});

// Message handling from clients
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received from client');
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      Promise.all(
        event.data.urls.map((url) => {
          return fetch(url).then((response) => {
            return caches.open(DYNAMIC_CACHE).then((cache) => {
              return cache.put(url, response);
            });
          });
        })
      )
    );
  }
});