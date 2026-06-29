import { FormSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="h-7 w-44 bg-gray-200 rounded mb-5 animate-pulse" />
      <FormSkeleton />
    </div>
  );
}
