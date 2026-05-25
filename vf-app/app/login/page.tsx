"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card max-w-sm w-full text-center space-y-6">
        {/* 로고 */}
        <div>
          <h1 className="text-4xl font-black text-blue-800">
            베프<span className="text-amber-500">.</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            짬에서 나오는 인생 조언 커뮤니티
          </p>
        </div>

        <div className="border-t border-b py-6 space-y-3">
          <p className="text-xs text-gray-400 mb-4">소셜 계정으로 간편 로그인</p>

          {/* 카카오 로그인 */}
          <button
            onClick={() => signIn("kakao", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.029 0 0 3.136 0 7c0 2.491 1.576 4.678 3.95 5.936L3.06 16.44a.3.3 0 00.444.334L7.78 14.06c.4.056.808.085 1.22.085 4.971 0 9-3.136 9-7S13.971 0 9 0z" fill="currentColor"/>
            </svg>
            카카오로 시작하기
          </button>

          {/* 구글 로그인 */}
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A9.009 9.009 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.163 6.656 3.583 9 3.583z" fill="#EA4335"/>
            </svg>
            Google로 시작하기
          </button>
        </div>

        <p className="text-xs text-gray-400">
          로그인 시{" "}
          <span className="underline cursor-pointer">서비스 이용약관</span> 및{" "}
          <span className="underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
