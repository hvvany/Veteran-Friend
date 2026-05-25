import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return new Date(date).toLocaleDateString("ko-KR");
}

export function formatYearsOfExp(years: number): string {
  if (years >= 30) return `${years}년 경력 마스터`;
  if (years >= 20) return `${years}년 경력 고수`;
  if (years >= 10) return `${years}년 경력 베테랑`;
  return `${years}년 경력`;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}
