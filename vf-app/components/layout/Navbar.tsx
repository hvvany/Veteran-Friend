"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { User, Home, Trophy, PenSquare } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="font-black text-blue-800 text-xl tracking-tight">
          베프<span className="text-amber-500">.</span>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-1">
          <NavItem href="/" icon={<Home size={18} />} label="홈" active={pathname === "/"} />
          <NavItem href="/hall-of-fame" icon={<Trophy size={18} />} label="명전" active={pathname === "/hall-of-fame"} />
          <NavItem href="/post/new" icon={<PenSquare size={18} />} label="올리기" active={pathname === "/post/new"} />

          {session ? (
            <div className="flex items-center gap-2 ml-2">
              <Link href="/profile" className={`p-2 rounded-lg transition-colors ${pathname === "/profile" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}>
                <User size={18} />
              </Link>
              <button onClick={() => signOut()} className="text-xs text-gray-400 hover:text-gray-600">
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
        active ? "text-blue-700 bg-blue-50" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
