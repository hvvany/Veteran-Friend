"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

/**
 * 신규 유저(isNew=true)를 자동으로 온보딩 페이지로 리다이렉트합니다.
 * RootLayout에 포함되어 전체 페이지에서 동작합니다.
 */
export default function OnboardingGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (pathname === "/onboarding" || pathname === "/login") return;

    if (session?.user?.isNew) {
      router.push("/onboarding");
    }
  }, [status, session, pathname, router]);

  return null;
}
