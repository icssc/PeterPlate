import { Card, CardContent } from "../shadcn/card";
import { Skeleton } from "./skeleton";

export default function FoodCardSkeleton() {
  return (
    <Card className="rounded-[6px] border-gray-300 bg-white shadow-none dark:border-[#3F3F47] dark:bg-[rgba(63,63,71,0.40)]">
      <CardContent>
        <div className="flex justify-between h-full pt-6">
          <div className="flex items-center gap-6">
            <Skeleton className="w-[84px] h-[84px] rounded-sm" />
            <div className="flex flex-col h-full gap-2">
              <Skeleton className="h-12 w-36" />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
