"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { applyVeteranVerification } from "@/actions/user";

export default function VeteranVerifyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const birthDate = (form.elements.namedItem("birthDate") as HTMLInputElement).value;
    const totalYears = Number((form.elements.namedItem("totalYears") as HTMLInputElement).value);

    startTransition(async () => {
      try {
        await applyVeteranVerification({ name, birthDate, totalYears });
        router.push("/profile");
      } catch (err) {
        alert((err as Error).message);
      }
    });
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-2">🛡️</div>
          <h1 className="text-xl font-black text-gray-900">베테랑 경력 인증</h1>
          <p className="text-gray-500 text-sm mt-1">건강보험 자격득실확인서 기반으로 인증해요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              name="name"
              required
              defaultValue={session?.user?.name ?? ""}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
            <input
              name="birthDate"
              required
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">총 경력 연수</label>
            <input
              name="totalYears"
              required
              type="number"
              min={1}
              max={50}
              placeholder="예: 25"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
            ⚠️ MVP 단계에서는 직접 입력 방식으로 운영됩니다. 정식 출시 시 NHI(건강보험공단) API 실인증으로 전환 예정입니다.
          </p>

          <button type="submit" disabled={isPending} className="btn-primary w-full py-3">
            {isPending ? "인증 중..." : "베테랑 인증 완료 →"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="w-full text-sm text-gray-400 hover:text-gray-600"
          >
            ← 프로필로 돌아가기
          </button>
        </form>
      </div>
    </div>
  );
}
