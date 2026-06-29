import { CardListSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="h-7 w-40 bg-gray-200 rounded mb-1 animate-pulse" />
      <div className="h-4 w-64 bg-gray-100 rounded mb-5 animate-pulse" />
      <CardListSkeleton count={4} />
    </div>
  );
}
