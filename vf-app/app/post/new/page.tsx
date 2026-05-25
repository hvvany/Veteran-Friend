"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/actions/post";

const CATEGORIES = [
  { value: "CAREER", label: "💼 커리어" },
  { value: "RELATIONSHIP", label: "👥 인간관계" },
  { value: "LIFE", label: "🌱 라이프" },
];

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("isAnonymous", String(isAnonymous));
      const { postId } = await createPost(formData);
      router.push(`/post/${postId}`);
    } catch (err) {
      alert((err as Error).message);
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-5">고민 털어놓기 📝</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">카테고리</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="category" value={cat.value} required className="sr-only peer" />
                <span className="px-3 py-1.5 rounded-full border text-sm font-medium transition-colors peer-checked:bg-blue-700 peer-checked:text-white peer-checked:border-blue-700 border-gray-300 text-gray-600 hover:border-blue-400">
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="title">
            제목
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={100}
            placeholder="고민을 한 줄로 요약해주세요"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="content">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={6}
            maxLength={2000}
            placeholder="상황을 자세히 설명할수록 더 좋은 조언을 받을 수 있어요."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 익명 설정 */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm text-gray-600">익명으로 게시하기</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? "게시 중..." : "고민 올리기 🚀"}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-3">
        게시 후 이 과장님(AI)이 먼저 답변해드리고, 실제 베테랑 선배들이 추가로 답해드려요!
      </p>
    </div>
  );
}
