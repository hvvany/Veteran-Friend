import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserProfile } from "@/actions/user";
import ProfileClient from "@/components/profile/ProfileClient";
import JjamCard from "@/components/veteran/JjamCard";
import { formatYearsOfExp } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const profile = await getUserProfile(session.user.id);
  if (!profile) redirect("/login");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">내 프로필</h1>

      {/* 짬 카드 (베테랑인 경우) */}
      {profile.role === "VETERAN" && profile.yearsOfExp && (
        <JjamCard user={profile} />
      )}

      {/* 기본 정보 */}
      <div className="card space-y-3">
        <div className="flex items-center gap-3">
          {profile.image && (
            <img src={profile.image} alt="" className="w-12 h-12 rounded-full" />
          )}
          <div>
            <p className="font-bold text-gray-900">{profile.nickname}</p>
            <p className="text-sm text-gray-500">
              {profile.role === "VETERAN" ? "🏅 베테랑" : "🌱 주니어"}
              {profile.yearsOfExp && ` · ${formatYearsOfExp(profile.yearsOfExp)}`}
            </p>
          </div>
        </div>

        {profile.bio && <p className="text-sm text-gray-600">{profile.bio}</p>}

        <div className="flex gap-4 text-center pt-2 border-t">
          <div>
            <p className="font-bold text-gray-900">{profile._count.posts}</p>
            <p className="text-xs text-gray-500">게시글</p>
          </div>
          <div>
            <p className="font-bold text-gray-900">{profile._count.comments}</p>
            <p className="text-xs text-gray-500">답변</p>
          </div>
          <div>
            <p className="font-bold text-amber-600">{profile.respectPoints}</p>
            <p className="text-xs text-gray-500">리스펙트</p>
          </div>
        </div>
      </div>

      {/* 프로필 수정 폼 */}
      <ProfileClient profile={profile} />

      {/* 베테랑 검증 섹션 */}
      {profile.role !== "VETERAN" && (
        <div className="card bg-amber-50 border-amber-200">
          <h2 className="font-bold text-amber-800 mb-1">🏅 베테랑으로 전환하기</h2>
          <p className="text-sm text-amber-700 mb-3">
            건강보험 자격득실확인서로 경력을 검증하면 베테랑 배지를 받을 수 있어요.
          </p>
          <Link href="/onboarding/veteran" className="btn-primary inline-block text-sm">
            베테랑 인증 시작 →
          </Link>
        </div>
      )}
    </div>
  );
}
