import RoadmapCard from "@/app/dashboard/roadmaps/_components/RoadmapCard";

import type { Roadmap } from "@/lib/types";

type RoadmapsListProps = {
  roadmaps: Roadmap[];
};

export default function RoadmapsList({ roadmaps }: RoadmapsListProps) {
  return (
    <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {roadmaps.map((roadmap) => (
        <RoadmapCard roadmap={roadmap} key={roadmap._id.toString()} />
      ))}
    </div>
  );
}
