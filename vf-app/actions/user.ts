"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  nickname: string;
  bio?: string;
  expertise?: string[];
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("로그인이 필요합니다.");

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      nickname: data.nickname,
      bio: data.bio,
      expertise: data.expertise ?? [],
    },
  });

  revalidatePath("/profile");
  return user;
}

export async function applyVeteranVerification(nhisData: {
  name: string;
  birthDate: string;
  totalYears: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("로그인이 필요합니다.");

  // TODO: NHI API 실제 연동 구현 필요
  // 현재는 입력받은 데이터로 업데이트 (MVP)
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: "VETERAN",
      verified: true,
      yearsOfExp: nhisData.totalYears,
    },
  });

  revalidatePath("/profile");
  return user;
}

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nickname: true,
      role: true,
      verified: true,
      yearsOfExp: true,
      respectPoints: true,
      image: true,
      bio: true,
      expertise: true,
      createdAt: true,
      _count: { select: { posts: true, comments: true } },
    },
  });
}

export async function setUserRole(role: "JUNIOR" | "VETERAN") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("로그인이 필요합니다.");

  return prisma.user.update({
    where: { id: session.user.id },
    data: { role },
  });
}
