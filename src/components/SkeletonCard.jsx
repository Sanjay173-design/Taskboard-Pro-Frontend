export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
}
