"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createComment(postId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("로그인이 필요합니다.");

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: session.user.id,
    },
    include: {
      author: {
        select: { id: true, nickname: true, role: true, verified: true, yearsOfExp: true, image: true },
      },
    },
  });

  revalidatePath(`/post/${postId}`);
  return comment;
}

export async function toggleRespect(commentId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("로그인이 필요합니다.");

  const existing = await prisma.respect.findUnique({
    where: { userId_commentId: { userId: session.user.id, commentId } },
  });

  if (existing) {
    // 리스펙트 취소
    await prisma.respect.delete({ where: { id: existing.id } });
    await prisma.comment.update({ where: { id: commentId }, data: { respects: { decrement: 1 } } });
    return { action: "removed" };
  } else {
    // 리스펙트 추가
    await prisma.respect.create({ data: { userId: session.user.id, commentId } });
    await prisma.comment.update({ where: { id: commentId }, data: { respects: { increment: 1 } } });

    // 댓글 작성자의 리스펙트 포인트도 증가
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (comment) {
      await prisma.user.update({
        where: { id: comment.authorId },
        data: { respectPoints: { increment: 1 } },
      });
    }
    return { action: "added" };
  }
}

export async function getHallOfFame() {
  return prisma.comment.findMany({
    where: { respects: { gte: 10 }, isAI: false },
    include: {
      author: {
        select: { id: true, nickname: true, role: true, verified: true, yearsOfExp: true, image: true },
      },
      post: { select: { id: true, title: true, category: true } },
    },
    orderBy: { respects: "desc" },
    take: 20,
  });
}
