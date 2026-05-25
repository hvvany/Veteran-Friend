"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { setUserRole, updateProfile, applyVeteranVerification } from "@/actions/user";

type Step = "role" | "nickname" | "veteran-verify";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<"JUNIOR" | "VETERAN">("JUNIOR");
  const [isPending, startTransition] = useTransition();

  // 소셜 계정 정보에서 기본 닉네임 추출
  const defaultNickname = session?.user?.nickname ?? 
    (session?.user?.name ?? "").replace(/\s+/g, "").slice(0, 10) || "";

  function handleRoleSelect(role: "JUNIOR" | "VETERAN") {
    setSelectedRole(role);
    setStep("nickname");
  }

  function handleNicknameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nickname = (e.currentTarget.elements.namedItem("nickname") as HTMLInputElement).value;

    startTransition(async () => {
      try {
        await setUserRole(selectedRole);
        await updateProfile({ nickname });
        if (selectedRole === "VETERAN") {
          setStep("veteran-verify");
        } else {
          router.push("/");
        }
      } catch (err) {
        alert((err as Error).message);
      }
    });
  }

  function handleVeteranVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const birthDate = (form.elements.namedItem("birthDate") as HTMLInputElement).value;
    const totalYears = Number((form.elements.namedItem("totalYears") as HTMLInputElement).value);

    startTransition(async () => {
      try {
        await applyVeteranVerification({ name, birthDate, totalYears });
        router.push("/");
      } catch (err) {
        alert((err as Error).message);
      }
    });
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card max-w-md w-full space-y-6">

        {/* Step 1: 역할 선택 */}
        {step === "role" && (
          <>
            <div className="text-center">
              {/* 소셜 계정 프로필 이미지 표시 */}
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-blue-100"
                />
              )}
              <h1 className="text-2xl font-black text-gray-900">
                {session?.user?.name ? `${session.user.name}님, 반가워요! 👋` : "반가워요! 👋"}
              </h1>
              <p className="text-gray-500 text-sm mt-2">베프에서 어떤 역할로 활동하실 건가요?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect("JUNIOR")}
                className="border-2 border-blue-200 hover:border-blue-500 rounded-2xl p-5 text-center transition-all hover:bg-blue-50"
              >
                <div className="text-4xl mb-2">🌱</div>
                <p className="font-bold text-gray-900">주니어</p>
                <p className="text-xs text-gray-500 mt-1">조언이 필요한 2030</p>
              </button>
              <button
                onClick={() => handleRoleSelect("VETERAN")}
                className="border-2 border-amber-200 hover:border-amber-500 rounded-2xl p-5 text-center transition-all hover:bg-amber-50"
              >
                <div className="text-4xl mb-2">🏅</div>
                <p className="font-bold text-gray-900">베테랑</p>
                <p className="text-xs text-gray-500 mt-1">경험을 나누는 5060</p>
              </button>
            </div>
          </>
        )}

        {/* Step 2: 닉네임 설정 */}
        {step === "nickname" && (
          <>
            <div className="text-center">
              <div className="text-4xl mb-2">{selectedRole === "VETERAN" ? "🏅" : "🌱"}</div>
              <h1 className="text-xl font-black text-gray-900">닉네임을 확인해주세요</h1>
              <p className="text-gray-500 text-sm mt-1">소셜 계정 정보로 자동 입력됐어요. 자유롭게 변경 가능해요!</p>
            </div>

            {/* 소셜 계정 정보 미리보기 */}
            {session?.user && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                {session.user.image && (
                  <img src={session.user.image} alt="" className="w-10 h-10 rounded-full" />
                )}
                <div>
                  <p className="text-xs text-gray-400">연동된 계정</p>
                  <p className="text-sm font-medium text-gray-700">{session.user.name}</p>
                  <p className="text-xs text-gray-400">{session.user.email}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleNicknameSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                <input
                  name="nickname"
                  required
                  maxLength={15}
                  minLength={2}
                  defaultValue={defaultNickname}
                  placeholder="닉네임 (2~15자)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">한글, 영문, 숫자 사용 가능 · 나중에 변경 가능</p>
              </div>
              <button type="submit" disabled={isPending} className="btn-primary w-full py-3">
                {isPending ? "설정 중..." : "시작하기 🚀"}
              </button>
              <button
                type="button"
                onClick={() => setStep("role")}
                className="w-full text-sm text-gray-400 hover:text-gray-600"
              >
                ← 역할 다시 선택
              </button>
            </form>
          </>
        )}

        {/* Step 3: 베테랑 경력 인증 */}
        {step === "veteran-verify" && (
          <>
            <div className="text-center">
              <div className="text-4xl mb-2">🛡️</div>
              <h1 className="text-xl font-black text-gray-900">경력 인증하기</h1>
              <p className="text-gray-500 text-sm mt-1">건강보험 자격득실확인서 기반으로 인증해요</p>
            </div>
            <form onSubmit={handleVeteranVerify} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  name="name"
                  required
                  defaultValue={session?.user?.name ?? ""}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
                <input
                  name="birthDate"
                  required
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onClick={() => router.push("/")}
                className="w-full text-sm text-gray-400 hover:text-gray-600"
              >
                나중에 인증하기
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

type Step = "role" | "nickname" | "veteran-verify" | "done";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<"JUNIOR" | "VETERAN">("JUNIOR");
  const [isPending, startTransition] = useTransition();

  function handleRoleSelect(role: "JUNIOR" | "VETERAN") {
    setSelectedRole(role);
    setStep("nickname");
  }

  function handleNicknameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nickname = (e.currentTarget.elements.namedItem("nickname") as HTMLInputElement).value;

    startTransition(async () => {
      try {
        await setUserRole(selectedRole);
        await updateProfile({ nickname });
        if (selectedRole === "VETERAN") {
          setStep("veteran-verify");
        } else {
          router.push("/");
        }
      } catch (err) {
        alert((err as Error).message);
      }
    });
  }

  function handleVeteranVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const birthDate = (form.elements.namedItem("birthDate") as HTMLInputElement).value;
    const totalYears = Number((form.elements.namedItem("totalYears") as HTMLInputElement).value);

    startTransition(async () => {
      try {
        await applyVeteranVerification({ name, birthDate, totalYears });
        router.push("/");
      } catch (err) {
        alert((err as Error).message);
      }
    });
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card max-w-md w-full space-y-6">

        {/* Step 1: 역할 선택 */}
        {step === "role" && (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-black text-gray-900">반가워요! 👋</h1>
              <p className="text-gray-500 text-sm mt-2">어떤 역할로 베프를 이용하실 건가요?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect("JUNIOR")}
                className="border-2 border-blue-200 hover:border-blue-500 rounded-2xl p-5 text-center transition-all"
              >
                <div className="text-4xl mb-2">🌱</div>
                <p className="font-bold text-gray-900">주니어</p>
                <p className="text-xs text-gray-500 mt-1">조언이 필요한 2030</p>
              </button>
              <button
                onClick={() => handleRoleSelect("VETERAN")}
                className="border-2 border-amber-200 hover:border-amber-500 rounded-2xl p-5 text-center transition-all"
              >
                <div className="text-4xl mb-2">🏅</div>
                <p className="font-bold text-gray-900">베테랑</p>
                <p className="text-xs text-gray-500 mt-1">경험을 나누는 5060</p>
              </button>
            </div>
          </>
        )}

        {/* Step 2: 닉네임 설정 */}
        {step === "nickname" && (
          <>
            <div className="text-center">
              <div className="text-4xl mb-2">{selectedRole === "VETERAN" ? "🏅" : "🌱"}</div>
              <h1 className="text-xl font-black text-gray-900">닉네임을 정해주세요</h1>
              <p className="text-gray-500 text-sm mt-1">나중에 변경 가능해요</p>
            </div>
            <form onSubmit={handleNicknameSubmit} className="space-y-3">
              <input
                name="nickname"
                required
                maxLength={15}
                minLength={2}
                placeholder="닉네임 (2~15자)"
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" disabled={isPending} className="btn-primary w-full py-3">
                {isPending ? "설정 중..." : "다음 →"}
              </button>
            </form>
          </>
        )}

        {/* Step 3: 베테랑 경력 인증 (선택) */}
        {step === "veteran-verify" && (
          <>
            <div className="text-center">
              <div className="text-4xl mb-2">🛡️</div>
              <h1 className="text-xl font-black text-gray-900">경력 인증하기</h1>
              <p className="text-gray-500 text-sm mt-1">건강보험 자격득실확인서 기반으로 인증해요</p>
            </div>
            <form onSubmit={handleVeteranVerify} className="space-y-3">
              <input name="name" required placeholder="이름" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="birthDate" required type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="totalYears" required type="number" min={1} max={50} placeholder="총 경력 연수" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400">* MVP 단계에서는 직접 입력, 실서비스에서 NHI API 연동 예정</p>
              <button type="submit" disabled={isPending} className="btn-primary w-full py-3">
                {isPending ? "인증 중..." : "인증 완료 →"}
              </button>
              <button type="button" onClick={() => router.push("/")} className="w-full text-sm text-gray-400 hover:text-gray-600">
                나중에 하기
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
