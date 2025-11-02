import Link from "next/link";
import RoadmapDropdownMenu from "@/app/dashboard/roadmaps/_components/RoadmapDropdownMenu";
import { Card, CardContent } from "@/components/ui/card";
import type { Roadmap } from "@/lib/types";
import { cn, getRoadmapProgressPercentage } from "@/lib/utils";

type RoadmapCardProps = {
  roadmap: Roadmap;
};

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const progress = getRoadmapProgressPercentage(roadmap);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <CardContent className="flex flex-col gap-4 rounded-xl ">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {roadmap.topic}
          </h3>
          <RoadmapDropdownMenu roadmapId={roadmap._id.toString()} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Progress
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
              <span>{progress}%</span>
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              style={{ width: `${progress}%` }}
              className="bg-primary h-2 rounded-full"
            ></div>
          </div>
        </div>
        <Link
          href={`/dashboard/roadmaps/${roadmap._id}`}
          className={cn(
            "py-2 mt-2 px-4 w-max flex flex-1 min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 bg-primary text-white text-sm font-bold tracking-wide hover:bg-primary/90",
          )}
        >
          Continue Learning
        </Link>
      </CardContent>
    </Card>
  );
}
