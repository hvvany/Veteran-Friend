import { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";

function customAdapter() {
  const adapter = PrismaAdapter(prisma);
  return {
    ...adapter,
    createUser: async (data: any) => {
      // 소셜 계정 name 기반으로 닉네임 자동 생성 (중복 방지 suffix 추가)
      const baseName = (data.name ?? data.email?.split("@")[0] ?? "user")
        .replace(/\s+/g, "")
        .slice(0, 10);
      const suffix = Math.floor(1000 + Math.random() * 9000);
      const nickname = `${baseName}${suffix}`;

      return prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          image: data.image,
          nickname,
          role: "JUNIOR",
        },
      });
    },
  };
}

export const authOptions: NextAuthOptions = {
  adapter: customAdapter(),
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      // 같은 이메일로 다른 provider 로그인 시 기존 계정에 자동 연결 (중복 생성 방지)
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            role: true,
            nickname: true,
            verified: true,
            yearsOfExp: true,
            respectPoints: true,
            name: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.nickname = dbUser.nickname;
          session.user.verified = dbUser.verified;
          session.user.yearsOfExp = dbUser.yearsOfExp;
          session.user.respectPoints = dbUser.respectPoints;
          session.user.name = dbUser.name ?? session.user.name;
          session.user.image = dbUser.image ?? session.user.image;
          // createdAt ≈ updatedAt (2초 이내) 이면 신규 유저 → 온보딩 필요
          // updateProfile 호출 시 updatedAt이 바뀌어 isNew = false 가 됨
          const isNew =
            Math.abs(dbUser.updatedAt.getTime() - dbUser.createdAt.getTime()) < 2000;
          session.user.isNew = isNew;
        }
      }
      return session;
    },
  },
  events: {
    // 최초 로그인(신규 유저)인 경우 감지 - 온보딩은 미들웨어에서 처리
    async createUser({ user }) {
      console.log(`[VF] 신규 유저 가입: ${user.email} (${user.name})`);
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24, // 1일 (24시간)
    updateAge: 60 * 60,   // 1시간마다 세션 갱신
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
      nickname?: string;
      verified?: boolean;
      yearsOfExp?: number | null;
      respectPoints?: number;
      isNew?: boolean;
    };
  }
}
