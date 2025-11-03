import { Card, CardContent } from "@/components/ui/card";

type RoadmapsSkeletonGridProps = {
  count: number;
};

export default function RoadmapsLoadingFallback({
  count,
}: RoadmapsSkeletonGridProps) {
  return (
    <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <RoadmapCardSkeleton key={`skeleton-${index + 1}`} />
      ))}
    </div>
  );
}

function RoadmapCardSkeleton() {
  return (
    <Card className="bg-muted">
      <CardContent className="flex flex-col gap-4 rounded-xl animate-pulse">
        {/* header */}
        <div className="flex items-start justify-between">
          <div className="h-5 w-full bg-gray-200 "></div>
        </div>

        {/* progress */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="h-4 w-20 bg-gray-200 "></div>
          </div>
          <div className="w-full bg-gray-200 -full h-2 overflow-hidden">
            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-1/2"></div>
          </div>
        </div>

        {/* button */}
        <div className="py-2 mt-2 px-4 w-max">
          <div className="h-10 w-36 bg-gray-200 -lg"></div>
        </div>
      </CardContent>
    </Card>
  );
}
