import { Card, CardContent } from "../shadcn/card";
import { Skeleton } from "./skeleton";

export default function EventCardSkeleton() {
  return (
    <Card className="">
      <CardContent className="flex items-center h-full pt-6 gap-6">
        <Skeleton className="w-48 h-36 rounded-sm" />
        <div className="flex flex-col gap-2 h-36" id="event-card-content">
          <Skeleton className="w-64 h-7" />
          <div className="flex items-center mb-4" id="event-card-subheader">
            <Skeleton className="w-48 h-4" />
          </div>
          <Skeleton className="w-96 h-2" />
          <Skeleton className="w-96 h-2" />
          <Skeleton className="w-80 h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
