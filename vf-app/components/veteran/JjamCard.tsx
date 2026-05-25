import { ShieldCheck } from "lucide-react";


interface JjamCardUser {
  nickname: string;
  role: string;
  verified: boolean;
  yearsOfExp: number | null;
  respectPoints?: number;
  image?: string | null;
  expertise?: string[];
}

interface JjamCardProps {
  user: JjamCardUser;
  compact?: boolean;
}

function getBadge(yearsOfExp: number): string {
  if (yearsOfExp >= 30) return "🏆 30년 마스터";
  if (yearsOfExp >= 20) return "🥇 20년 고수";
  if (yearsOfExp >= 10) return "🥈 10년 베테랑";
  return "🥉 경력직";
}

export default function JjamCard({ user, compact = false }: JjamCardProps) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-2">
        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
          {user.nickname[0]}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-800">{user.nickname}</p>
          {user.yearsOfExp && (
            <p className="text-xs text-amber-600">{getBadge(user.yearsOfExp)}</p>
          )}
        </div>
        {user.verified && <ShieldCheck size={14} className="text-primary-500 flex-shrink-0" />}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 text-xs text-amber-700 font-semibold">
          <ShieldCheck size={14} />
          짬 카드 (Jjam Card)
        </div>
        <span className="text-2xl">🏅</span>
      </div>

      {/* 프로필 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-amber-200 overflow-hidden flex-shrink-0">
          {user.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-amber-700 font-black text-xl">
              {user.nickname[0]}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-black text-gray-900 text-lg">{user.nickname}</p>
            {user.verified && <ShieldCheck size={16} className="text-primary-500" />}
          </div>
          {user.yearsOfExp && (
            <p className="text-amber-700 font-bold text-sm">{getBadge(user.yearsOfExp)}</p>
          )}
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-primary-600">{user.yearsOfExp ?? "?"}</p>
          <p className="text-xs text-gray-500">경력 (년)</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-amber-600">{user.respectPoints ?? 0}</p>
          <p className="text-xs text-gray-500">리스펙트</p>
        </div>
      </div>

      {/* 전문 분야 */}
      {user.expertise && user.expertise.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {user.expertise.map((tag) => (
            <span key={tag} className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 검증 배지 */}
      {user.verified && (
        <p className="text-xs text-primary-600 mt-3 flex items-center gap-1">
          <ShieldCheck size={12} /> 건강보험공단 경력 인증 완료
        </p>
      )}
    </div>
  );
}
