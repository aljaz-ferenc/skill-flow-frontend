import { Suspense } from "react";

export const dynamic = "force-dynamic";

import NewRoadmapCard from "@/app/dashboard/roadmaps/_components/NewRoadmapCard";
import RoadmapSearch from "@/app/dashboard/roadmaps/_components/RoadmapSearch";
import RoadmapsList from "@/app/dashboard/roadmaps/_components/RoadmapsList";
import RoadmapsLoadingFallback from "@/app/dashboard/roadmaps/_components/RoadmapsLoadingFallback";
import { getRoadmaps } from "@/lib/actions";
import type { Roadmap } from "@/lib/types";

export default async function RoadmapsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const roadmapsPromise = getRoadmaps(query);

  return (
    <main className="w-full max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold">My Roadmaps</h2>
        <NewRoadmapCard />
      </div>
      <RoadmapSearch />
      <Suspense fallback={<RoadmapsLoadingFallback count={5} />}>
        <RoadmapsListWrapper roadmapsPromise={roadmapsPromise} />
      </Suspense>
    </main>
  );
}

async function RoadmapsListWrapper({
  roadmapsPromise,
}: {
  roadmapsPromise: Promise<Roadmap[]>;
}) {
  const roadmaps = await roadmapsPromise;

  return <RoadmapsList roadmaps={roadmaps} />;
}
