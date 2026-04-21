// sw.js — 복약 알림 Service Worker
const CACHE = 'med-reminder-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// 메인 앱에서 postMessage로 알림 요청을 받아 처리
// (앱이 백그라운드/잠금화면 상태에서도 registration.showNotification은 작동)
self.addEventListener('message', e => {
  if (!e.data || e.data.type !== 'NOTIFY') return;
  const { title, body, tag } = e.data;
  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      icon: './icon-b-premium.svg',
      badge: './icon-b-premium.svg',
      requireInteraction: false,
      silent: false,
    })
  );
});

// 알림 탭하면 앱 포커스
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length) return list[0].focus();
      return clients.openWindow(self.registration.scope);
    })
  );
});
