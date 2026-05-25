import { Role, Category } from "@prisma/client";

export type { Role, Category };

export interface UserWithStats {
  id: string;
  nickname: string;
  role: Role;
  verified: boolean;
  yearsOfExp: number | null;
  respectPoints: number;
  image: string | null;
  bio: string | null;
  expertise: string[];
}

export interface PostWithAuthor {
  id: string;
  title: string;
  content: string;
  category: Category;
  isAnonymous: boolean;
  viewCount: number;
  createdAt: Date;
  author: UserWithStats;
  _count: { comments: number };
}

export interface CommentWithAuthor {
  id: string;
  content: string;
  isAI: boolean;
  respects: number;
  createdAt: Date;
  author: UserWithStats;
  postId: string;
}

export interface JjamCardData {
  nickname: string;
  yearsOfExp: number;
  expertise: string[];
  respectPoints: number;
  verified: boolean;
  badge: string; // "30년 마스터", "20년 고수" 등
}

export type CategoryLabel = {
  [key in Category]: string;
};

export const CATEGORY_LABELS: CategoryLabel = {
  CAREER: "커리어",
  RELATIONSHIP: "인간관계",
  LIFE: "라이프",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  CAREER: "bg-blue-100 text-blue-700",
  RELATIONSHIP: "bg-pink-100 text-pink-700",
  LIFE: "bg-green-100 text-green-700",
};

export function getVeteranBadge(yearsOfExp: number): string {
  if (yearsOfExp >= 30) return "🏆 30년 마스터";
  if (yearsOfExp >= 20) return "🥇 20년 고수";
  if (yearsOfExp >= 10) return "🥈 10년 베테랑";
  return "🥉 경력직";
}
