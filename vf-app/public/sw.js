// 베프 Service Worker - 푸시 알림 처리

self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title ?? "베프", {
      body: data.body ?? "",
      icon: "/icon.svg",
      badge: "/icon.svg",
      vibrate: [200, 100, 200],
      data: { url: data.url ?? "/" },
      tag: data.tag ?? "vf-notification",
      renotify: true,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url ?? "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // 이미 열린 탭이 있으면 포커스
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        // 없으면 새 탭 오픈
        return clients.openWindow(url);
      })
  );
});
