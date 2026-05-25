import { getPostById } from "@/actions/post";
import { notFound } from "next/navigation";
import CommentSection from "@/components/post/CommentSection";
import { CATEGORY_LABELS, CATEGORY_COLORS, getVeteranBadge } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import JjamCard from "@/components/veteran/JjamCard";
import { ShieldCheck } from "lucide-react";

interface PostPageProps {
  params: { id: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostById(params.id);
  if (!post) return notFound();

  const isAnonymous = post.isAnonymous;
  const author = post.author;

  return (
    <div className="space-y-4">
      {/* 게시글 헤더 */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category]}`}>
            {CATEGORY_LABELS[post.category]}
          </span>
          <span className="text-xs text-gray-400">{formatRelativeTime(post.createdAt)}</span>
          <span className="text-xs text-gray-400 ml-auto">조회 {post.viewCount}</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>

        {/* 작성자 정보 */}
        <div className="mt-4 pt-4 border-t flex items-center gap-2">
          {isAnonymous ? (
            <span className="text-sm text-gray-500">익명의 주니어</span>
          ) : (
            <span className="text-sm font-medium text-gray-700">{author.nickname}</span>
          )}
        </div>
      </div>

      {/* 베테랑 짬 카드 (답글 상단에 표시) */}
      {post.comments.some((c) => !c.isAI && c.author.role === "VETERAN") && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-700 mb-3 flex items-center gap-1">
            <ShieldCheck size={14} /> 이 글에 답한 베테랑
          </p>
          <div className="flex gap-3 flex-wrap">
            {post.comments
              .filter((c) => !c.isAI && c.author.role === "VETERAN" && c.author.verified)
              .map((c) => (
                <JjamCard key={c.author.id} user={c.author} compact />
              ))}
          </div>
        </div>
      )}

      {/* 댓글 섹션 */}
      <CommentSection postId={post.id} comments={post.comments} />
    </div>
  );
}
