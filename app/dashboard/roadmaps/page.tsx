export const dynamic = "force-dynamic";

import NewRoadmapCard from "@/app/dashboard/roadmaps/_components/NewRoadmapCard";
import RoadmapCard from "@/app/dashboard/roadmaps/_components/RoadmapCard";
import { getRoadmaps } from "@/lib/actions";

export default async function RoadmapsPage() {
  const roadmaps = await getRoadmaps();

  return (
    <main>
      <h2 className="text-4xl font-bold mb-10">My Roadmaps</h2>
      <div className="flex flex-wrap gap-5">
        {roadmaps?.map((roadmap) => (
          <RoadmapCard roadmap={roadmap} key={roadmap._id.toString()} />
        ))}
        <NewRoadmapCard />
      </div>
    </main>
  );
}
