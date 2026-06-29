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
    // 리스펙트 취소 - 병렬 실행
    await Promise.all([
      prisma.respect.delete({ where: { id: existing.id } }),
      prisma.comment.update({ where: { id: commentId }, data: { respects: { decrement: 1 } } }),
    ]);
    return { action: "removed" };
  } else {
    // 리스펙트 추가 - 병렬 실행 + 작성자 포인트 증가는 fire-and-forget
    const [, comment] = await Promise.all([
      prisma.respect.create({ data: { userId: session.user.id, commentId } }),
      prisma.comment.update({
        where: { id: commentId },
        data: { respects: { increment: 1 } },
        select: { authorId: true },
      }),
    ]);

    // 댓글 작성자의 리스펙트 포인트 증가 - fire-and-forget (백그라운드)
    if (comment) {
      prisma.user.update({
        where: { id: comment.authorId },
        data: { respectPoints: { increment: 1 } },
      }).catch(() => {});
    }
    return { action: "added" };
  }
}

export async function getUserRespectedCommentIds(commentIds: string[]): Promise<string[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || commentIds.length === 0) return [];

  const respects = await prisma.respect.findMany({
    where: { userId: session.user.id, commentId: { in: commentIds } },
    select: { commentId: true },
  });
  return respects.map((r) => r.commentId);
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
