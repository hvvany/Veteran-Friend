"use server";

import webpush from "web-push";
import { prisma } from "./db";

webpush.setVapidDetails(
  "mailto:admin@veteranfriend.app",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

/** 특정 유저의 모든 구독에 알림 전송 */
export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; url?: string; tag?: string }
) {
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  if (subs.length === 0) return;

  await Promise.allSettled(
    subs.map((sub) =>
      webpush
        .sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload)
        )
        .catch(async (err: { statusCode?: number }) => {
          // 410 Gone = 만료된 구독, DB에서 삭제
          if (err.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          }
        })
    )
  );
}

/** 전체 구독자에게 알림 전송 */
export async function sendPushToAll(
  payload: { title: string; body: string; url?: string; tag?: string }
) {
  const subs = await prisma.pushSubscription.findMany();
  if (subs.length === 0) return;

  await Promise.allSettled(
    subs.map((sub) =>
      webpush
        .sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload)
        )
        .catch(async (err: { statusCode?: number }) => {
          if (err.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          }
        })
    )
  );
}
