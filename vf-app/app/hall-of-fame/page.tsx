import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getHallOfFame } from "@/actions/comment";
import { CATEGORY_LABELS } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { getVeteranBadge } from "@/types";

export default async function HallOfFamePage() {
  const session = await getServerSession(authOptions);
  const comments = await getHallOfFame();

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">🏆 명예의 전당</h1>
      <p className="text-sm text-gray-500 mb-5">리스펙트 10개 이상 받은 베테랑의 조언들</p>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="card border-l-4 border-amber-400">
            <a href={`/post/${comment.post.id}`} className="block">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-veteran">
                  {comment.author.yearsOfExp
                    ? getVeteranBadge(comment.author.yearsOfExp)
                    : "🏅 베테랑"}
                </span>
                <span className="font-semibold text-sm text-gray-800">{comment.author.nickname}</span>
                <span className="text-xs text-gray-400 ml-auto">{formatRelativeTime(comment.createdAt)}</span>
              </div>
              <p className="text-xs text-gray-400 mb-1">
                [{CATEGORY_LABELS[comment.post.category]}] {comment.post.title}
              </p>
              <p className="text-sm text-gray-700 line-clamp-3">{comment.content}</p>
              <p className="text-amber-600 font-bold text-sm mt-2">👏 {comment.respects} 리스펙트</p>
            </a>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="card text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">🏆</p>
            <p>아직 명예의 전당에 오른 조언이 없어요.</p>
            <p className="text-xs mt-1">리스펙트를 10개 이상 받으면 등록돼요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
