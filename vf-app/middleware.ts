import { NextRequest, NextResponse } from "next/server";

// DB 세션 전략 사용 시 미들웨어에서 세션 체크 불가
// 각 보호 페이지(profile 등)에서 getServerSession으로 직접 인증 처리
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
