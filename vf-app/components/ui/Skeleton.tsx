// 공용 스켈레톤 컴포넌트 - 로딩 시 자리표시자
export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-16 bg-gray-200 rounded-full" />
        <div className="h-3 w-12 bg-gray-100 rounded ml-auto" />
      </div>
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-full bg-gray-100 rounded mb-1" />
      <div className="h-3 w-5/6 bg-gray-100 rounded mb-3" />
      <div className="flex items-center gap-3">
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-3 w-10 bg-gray-100 rounded ml-auto" />
      </div>
    </div>
  );
}

export function CardListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-3 w-12 bg-gray-100 rounded" />
        </div>
        <div className="h-6 w-4/5 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-full bg-gray-100 rounded mb-2" />
        <div className="h-4 w-full bg-gray-100 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
      </div>
      <CardListSkeleton count={3} />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="card animate-pulse space-y-4">
      <div className="h-4 w-20 bg-gray-200 rounded" />
      <div className="h-10 w-full bg-gray-100 rounded-lg" />
      <div className="h-4 w-20 bg-gray-200 rounded" />
      <div className="h-24 w-full bg-gray-100 rounded-lg" />
      <div className="h-10 w-full bg-primary-100 rounded-lg" />
    </div>
  );
}
