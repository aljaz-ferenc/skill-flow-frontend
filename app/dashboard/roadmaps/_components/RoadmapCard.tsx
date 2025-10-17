import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Roadmap } from "@/lib/types";

type RoadmapCardProps = {
  roadmap: Roadmap;
};

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  return (
    <Link
      href={`/dashboard/roadmaps/${roadmap._id}`}
      className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {roadmap.topic}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          description
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <div className="bg-primary h-2.5 rounded-full"></div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>45% Complete</span>
          <button
            type="button"
            className="flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Continue
            <span className="material-symbols-outlined text-base">
              <ArrowRight />
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}
