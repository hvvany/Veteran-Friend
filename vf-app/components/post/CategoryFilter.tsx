"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { value: undefined, label: "전체" },
  { value: "CAREER", label: "💼 커리어" },
  { value: "RELATIONSHIP", label: "👥 인간관계" },
  { value: "LIFE", label: "🌱 라이프" },
] as const;

interface CategoryFilterProps {
  currentCategory?: string;
}

export default function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat.value || (cat.value === undefined && !currentCategory);
        const href = cat.value ? `/?category=${cat.value}` : "/";
        return (
          <Link
            key={cat.label}
            href={href}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-700 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400"
            }`}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
