import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // 온보딩 완료 여부 체크: nickname이 숫자로만 끝나는 자동생성 형태면 온보딩 필요
    // (실제로는 별도 isOnboarded 필드가 있으면 더 좋지만 MVP에선 role 기반으로 판단)
    const isOnboarded = token?.nickname && token?.role;

    // 보호된 페이지에 접근 시 로그인 안 되어 있으면 /login으로
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // 보호 불필요 경로는 항상 허용
        if (
          pathname.startsWith("/login") ||
          pathname.startsWith("/onboarding") ||
          pathname.startsWith("/api") ||
          pathname === "/"
        ) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/profile/:path*", "/post/new", "/hall-of-fame"],
};
