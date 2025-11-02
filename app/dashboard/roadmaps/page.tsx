export const dynamic = "force-dynamic";

import NewRoadmapCard from "@/app/dashboard/roadmaps/_components/NewRoadmapCard";
import RoadmapsList from "@/app/dashboard/roadmaps/_components/RoadmapsList";
import { getRoadmaps } from "@/lib/actions";

export default async function RoadmapsPage() {
  const roadmaps = await getRoadmaps();

  return (
    <main className="w-full max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold mb-10">My Roadmaps</h2>
        <NewRoadmapCard />
      </div>
      <RoadmapsList roadmaps={roadmaps} />
    </main>
  );
}
