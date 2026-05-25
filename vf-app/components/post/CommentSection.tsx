"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { createComment, toggleRespect } from "@/actions/comment";
import { formatRelativeTime } from "@/lib/utils";
import { getVeteranBadge } from "@/types";
import { ThumbsUp, Bot, ShieldCheck } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  isAI: boolean;
  respects: number;
  createdAt: Date;
  author: {
    id: string;
    nickname: string;
    role: string;
    verified: boolean;
    yearsOfExp: number | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export default function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        const newComment = await createComment(postId, content);
        setComments((prev) => [...prev, newComment as Comment]);
        setContent("");
      } catch (err) {
        alert((err as Error).message);
      }
    });
  }

  function handleRespect(commentId: string) {
    startTransition(async () => {
      try {
        await toggleRespect(commentId);
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, respects: c.respects + 1 } : c
          )
        );
      } catch (err) {
        alert((err as Error).message);
      }
    });
  }

  return (
    <div className="space-y-3">
      <h2 className="font-bold text-gray-900">
        답변 <span className="text-blue-700">{comments.length}</span>
      </h2>

      {/* 댓글 목록 */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={`card ${comment.isAI ? "border-blue-200 bg-blue-50" : ""}`}
        >
          {/* 작성자 정보 */}
          <div className="flex items-center gap-2 mb-2">
            {comment.isAI ? (
              <>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <span className="font-semibold text-sm text-blue-800">이 과장님 AI</span>
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">AI 멘토</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {comment.author.image ? (
                    <img src={comment.author.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
                      {comment.author.nickname[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-gray-800">{comment.author.nickname}</span>
                    {comment.author.role === "VETERAN" && (
                      <span className="badge-veteran">
                        {comment.author.verified && comment.author.yearsOfExp
                          ? getVeteranBadge(comment.author.yearsOfExp)
                          : "🏅 베테랑"}
                      </span>
                    )}
                    {comment.author.verified && (
                      <ShieldCheck size={13} className="text-blue-500" />
                    )}
                  </div>
                </div>
              </>
            )}
            <span className="text-xs text-gray-400 ml-auto">{formatRelativeTime(comment.createdAt)}</span>
          </div>

          {/* 내용 */}
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.content}</p>

          {/* 리스펙트 버튼 */}
          <div className="mt-3 flex items-center">
            <button
              onClick={() => handleRespect(comment.id)}
              disabled={isPending || !session || comment.isAI}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                comment.isAI
                  ? "text-gray-300 cursor-default"
                  : comment.respects > 0
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  : "bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
              }`}
            >
              <ThumbsUp size={13} />
              리스펙트 {comment.respects > 0 && <strong>{comment.respects}</strong>}
            </button>
          </div>
        </div>
      ))}

      {/* 댓글 작성 폼 */}
      {session ? (
        <form onSubmit={handleSubmit} className="card space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            {session.user?.role === "VETERAN" ? "🏅 베테랑으로 답변하기" : "답변 달기"}
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="진심 어린 조언을 남겨주세요..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? "게시 중..." : "답변 올리기"}
          </button>
        </form>
      ) : (
        <div className="card text-center py-6 text-gray-500">
          <p className="text-sm">답변하려면 로그인이 필요해요</p>
        </div>
      )}
    </div>
  );
}
