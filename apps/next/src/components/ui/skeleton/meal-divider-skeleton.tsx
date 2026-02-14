import { Skeleton } from "./skeleton";

export default function MealDividerSkeleton() {
  return (
    <div>
      <Skeleton className="w-28 h-7 mb-2" />
      <Skeleton className="w-full h-0.5" />
    </div>
  );
}
