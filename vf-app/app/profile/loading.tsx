import { CardSkeleton, FormSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <CardSkeleton />
      <FormSkeleton />
    </div>
  );
}
