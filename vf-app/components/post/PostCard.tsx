import Link from "next/link";
import { MessageCircle, Eye } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: "CAREER" | "RELATIONSHIP" | "LIFE";
    isAnonymous: boolean;
    viewCount: number;
    createdAt: Date;
    author: {
      nickname: string;
      role: string;
      verified: boolean;
      yearsOfExp: number | null;
    };
    _count: { comments: number };
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/post/${post.id}`}>
      <div className="card hover:shadow-md hover:border-primary-100 transition-all cursor-pointer">
        {/* 상단: 카테고리 + 날짜 */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category]}`}>
            {CATEGORY_LABELS[post.category]}
          </span>
          <span className="text-xs text-gray-400 ml-auto">{formatRelativeTime(post.createdAt)}</span>
        </div>

        {/* 제목 */}
        <h2 className="font-bold text-gray-900 mb-1 line-clamp-2">{post.title}</h2>

        {/* 내용 미리보기 */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.content}</p>

        {/* 하단: 작성자 + 통계 */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>
            {post.isAnonymous
              ? "익명"
              : post.author.role === "VETERAN"
              ? `🏅 ${post.author.nickname}`
              : post.author.nickname}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <MessageCircle size={13} />
            {post._count.comments}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={13} />
            {post.viewCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
