"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Category } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getManagerLeeResponse } from "@/lib/gemini";

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("로그인이 필요합니다.");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as Category;
  const isAnonymous = formData.get("isAnonymous") === "true";

  if (!title || !content || !category) {
    throw new Error("모든 필드를 입력해주세요.");
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      category,
      isAnonymous,
      authorId: session.user.id,
    },
  });

  // 베테랑 응답이 없을 때를 대비해 AI(이 과장님) 자동 응답 예약
  // 실제 서비스에서는 큐 시스템으로 처리 (ex. 30분 후 베테랑 댓글 없으면 AI 응답)
  scheduleManagerLeeResponse(post.id, content, category);

  revalidatePath("/feed");
  return { postId: post.id };
}

export async function getPosts(category?: Category, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const where = category ? { category } : {};

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            role: true,
            verified: true,
            yearsOfExp: true,
            image: true,
          },
        },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, totalPages: Math.ceil(total / limit) };
}

export async function getPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
          role: true,
          verified: true,
          yearsOfExp: true,
          image: true,
          expertise: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
              role: true,
              verified: true,
              yearsOfExp: true,
              image: true,
            },
          },
        },
        orderBy: [{ respects: "desc" }, { createdAt: "asc" }],
      },
    },
  });

  if (post) {
    // 조회수 증가 - fire-and-forget (비동기, await 없이 백그라운드 실행)
    prisma.post.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
    post.viewCount += 1;
  }

  return post;
}

// 이 과장님 자동 응답 스케줄링 (MVP: 즉시 응답, 실서비스: 큐 활용)
async function scheduleManagerLeeResponse(
  postId: string,
  content: string,
  category: Category
) {
  try {
    const aiUser = await prisma.user.findFirst({ where: { nickname: "이 과장님" } });
    if (!aiUser) return;

    const response = await getManagerLeeResponse(content, category);

    await prisma.comment.create({
      data: {
        content: response,
        isAI: true,
        postId,
        authorId: aiUser.id,
      },
    });
  } catch (error) {
    console.error("이 과장님 응답 생성 실패:", error);
  }
}
