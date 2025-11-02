"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import RoadmapCard from "@/app/dashboard/roadmaps/_components/RoadmapCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Roadmap } from "@/lib/types";

type RoadmapsListProps = {
  roadmaps: Roadmap[];
};

export default function RoadmapsList({ roadmaps }: RoadmapsListProps) {
  const [query, setQuery] = useState("");
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<Roadmap[]>(roadmaps);

  useEffect(() => {
    if (!query) {
      setFilteredRoadmaps(roadmaps);
      return;
    }

    setFilteredRoadmaps(
      roadmaps.filter((r) =>
        r.topic.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  }, [query, roadmaps]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 py-4">
        <div className="flex-1">
          <Label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-gray-500 dark:text-gray-400 flex border-none bg-white dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                <Search size={18} />
              </div>
              <Input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-white dark:bg-gray-800 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 pl-2 text-base font-normal leading-normal"
                placeholder="Search roadmaps..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </Label>
        </div>
      </div>
      <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoadmaps.map((roadmap) => (
          <RoadmapCard roadmap={roadmap} key={roadmap._id.toString()} />
        ))}
      </div>
    </>
  );
}
