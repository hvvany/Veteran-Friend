import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/components/auth/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import OnboardingGuard from "@/components/auth/OnboardingGuard";

export const metadata: Metadata = {
  title: "베프 (VF) - Veteran Friend",
  description: "5060 베테랑의 짬에서 나오는 인생 조언 커뮤니티",
  openGraph: {
    title: "베프 (VF) - Veteran Friend",
    description: "경험에서 나온 진짜 조언, 베프에서 만나세요.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "베프",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ko">
      <body>
        <SessionProvider session={session}>
          <div className="min-h-screen bg-gray-50">
            <OnboardingGuard />
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
