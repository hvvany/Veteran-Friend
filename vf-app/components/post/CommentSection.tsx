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
  userRespectedIds?: string[];
}

export default function CommentSection({ postId, comments: initialComments, userRespectedIds = [] }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [respectedIds, setRespectedIds] = useState<Set<string>>(() => new Set(userRespectedIds));
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !session?.user) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticComment: Comment = {
      id: tempId,
      content: content.trim(),
      isAI: false,
      respects: 0,
      createdAt: new Date(),
      author: {
        id: session.user.id,
        nickname: session.user.nickname ?? session.user.name ?? "사용자",
        role: session.user.role ?? "JUNIOR",
        verified: session.user.verified ?? false,
        yearsOfExp: session.user.yearsOfExp ?? null,
        image: session.user.image ?? null,
      },
    };

    // Optimistic Update: 먼저 UI에 추가
    setComments((prev) => [...prev, optimisticComment]);
    const savedContent = content;
    setContent("");

    startTransition(async () => {
      try {
        const newComment = await createComment(postId, savedContent);
        // 성공 시 임시 댓글을 실제 댓글로 교체
        setComments((prev) =>
          prev.map((c) => (c.id === tempId ? (newComment as Comment) : c))
        );
      } catch (err) {
        // 실패 시 롤백
        setComments((prev) => prev.filter((c) => c.id !== tempId));
        setContent(savedContent);
        alert((err as Error).message);
      }
    });
  }

  function handleRespect(commentId: string) {
    if (!session) {
      alert("리스펙트는 로그인 후 가능해요.");
      return;
    }

    const wasRespected = respectedIds.has(commentId);

    // Optimistic Update: 먼저 UI 업데이트
    if (wasRespected) {
      setRespectedIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, respects: Math.max(0, c.respects - 1) } : c
        )
      );
    } else {
      setRespectedIds((prev) => new Set([...prev, commentId]));
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, respects: c.respects + 1 } : c
        )
      );
    }

    // 서버 요청 (백그라운드)
    startTransition(async () => {
      try {
        const result = await toggleRespect(commentId);
        // 서버 응답이 예상과 다르면 다시 동기화 (드문 경우)
        const serverAdded = result.action === "added";
        if (serverAdded === wasRespected) {
          // 이미 Optimistic으로 반영했으므로 추가 작업 불필요
        }
      } catch (err) {
        // 실패 시 롤백
        if (wasRespected) {
          setRespectedIds((prev) => new Set([...prev, commentId]));
          setComments((prev) =>
            prev.map((c) =>
              c.id === commentId ? { ...c, respects: c.respects + 1 } : c
            )
          );
        } else {
          setRespectedIds((prev) => {
            const next = new Set(prev);
            next.delete(commentId);
            return next;
          });
          setComments((prev) =>
            prev.map((c) =>
              c.id === commentId ? { ...c, respects: Math.max(0, c.respects - 1) } : c
            )
          );
        }
        alert((err as Error).message);
      }
    });
  }

  return (
    <div className="space-y-3">
      <h2 className="font-bold text-gray-900">
        답변 <span className="text-primary-600">{comments.length}</span>
      </h2>

      {/* 댓글 목록 */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={`card ${comment.isAI ? "border-primary-200 bg-primary-50" : ""}`}
        >
          {/* 작성자 정보 */}
          <div className="flex items-center gap-2 mb-2">
            {comment.isAI ? (
              <>
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <span className="font-semibold text-sm text-primary-800">이 과장님 AI</span>
                  <span className="ml-2 text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded">AI 멘토</span>
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
                      <ShieldCheck size={13} className="text-primary-500" />
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
              disabled={isPending || comment.isAI}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                comment.isAI
                  ? "text-gray-300 cursor-default"
                  : respectedIds.has(comment.id)
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  : "bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
              }`}
            >
              <ThumbsUp size={13} className={respectedIds.has(comment.id) ? "fill-amber-500 text-amber-500" : ""} />
              {respectedIds.has(comment.id) ? "리스펙트함" : "리스펙트"}
              {comment.respects > 0 && <strong>{comment.respects}</strong>}
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
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
