import { CardListSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-6 mb-6 text-white">
        <h1 className="text-2xl font-bold mb-1">짬에서 나오는 바이브 ✨</h1>
        <p className="text-primary-100 text-sm">불러오는 중...</p>
      </div>
      <div className="flex gap-2 flex-wrap mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
      <CardListSkeleton count={5} />
    </div>
  );
}
