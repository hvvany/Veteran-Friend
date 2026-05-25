"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/actions/user";

interface ProfileData {
  nickname: string;
  bio: string | null;
  expertise: string[];
  role: string;
}

export default function ProfileClient({ profile }: { profile: ProfileData }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState(profile.expertise.join(", "));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nickname = (form.elements.namedItem("nickname") as HTMLInputElement).value;
    const bio = (form.elements.namedItem("bio") as HTMLTextAreaElement).value;
    const expertise = expertiseInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      try {
        await updateProfile({ nickname, bio, expertise });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (err) {
        alert((err as Error).message);
      }
    });
  }

  return (
    <div className="card space-y-4">
      <h2 className="font-bold text-gray-900">프로필 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
          <input
            name="nickname"
            defaultValue={profile.nickname}
            required
            maxLength={20}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">한 줄 소개</label>
          <textarea
            name="bio"
            defaultValue={profile.bio ?? ""}
            rows={2}
            maxLength={100}
            placeholder="나를 간단히 소개해주세요"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {profile.role === "VETERAN" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전문 분야 (쉼표로 구분)</label>
            <input
              value={expertiseInput}
              onChange={(e) => setExpertiseInput(e.target.value)}
              placeholder="예: 마케팅, 영업, 조직관리"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <button type="submit" disabled={isPending} className="btn-primary w-full">
          {isPending ? "저장 중..." : success ? "✅ 저장 완료!" : "저장하기"}
        </button>
      </form>
    </div>
  );
}
