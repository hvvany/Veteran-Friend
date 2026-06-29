"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, BellOff } from "lucide-react";

export default function PushNotificationButton() {
  const { data: session } = useSession();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    setSupported(true);

    // 현재 구독 상태 확인
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setSubscribed(!!sub);
      });
    });
  }, []);

  if (!supported || !session) return null;

  async function togglePush() {
    if (loading) return;
    setLoading(true);

    try {
      const reg = await navigator.serviceWorker.ready;

      if (subscribed) {
        // 구독 해제
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          await fetch("/api/push/subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
        }
        setSubscribed(false);
      } else {
        // 알림 권한 요청
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          alert("알림 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.");
          return;
        }

        // 구독 등록
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        });

        const json = sub.toJSON();
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: json.endpoint,
            keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
          }),
        });
        setSubscribed(true);
      }
    } catch (err) {
      console.error("Push toggle error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={togglePush}
      disabled={loading}
      title={subscribed ? "알림 끄기" : "알림 켜기"}
      className={`p-1.5 rounded-full transition-colors ${
        subscribed
          ? "text-primary-600 bg-primary-50 hover:bg-primary-100"
          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      }`}
    >
      {subscribed ? <Bell size={18} /> : <BellOff size={18} />}
    </button>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
