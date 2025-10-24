import { ArrowRight } from "lucide-react";
import Link from "next/link";
import RoadmapDropdownMenu from "@/app/dashboard/roadmaps/_components/RoadmapDropdownMenu";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Roadmap } from "@/lib/types";
import { cn } from "@/lib/utils";

type RoadmapCardProps = {
  roadmap: Roadmap;
};

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  return (
    <Card className=" shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="w-70">
        <header className=" flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {roadmap.topic}
          </h3>
          <RoadmapDropdownMenu roadmapId={roadmap._id.toString()} />
        </header>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          description
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <div className="bg-primary h-2.5 rounded-full"></div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>45% Complete</span>
          <Link
            href={`/dashboard/roadmaps/${roadmap._id}`}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              buttonVariants({ variant: "link" }),
            )}
          >
            Continue
            <span className="material-symbols-outlined text-base">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
