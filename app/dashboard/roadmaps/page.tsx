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
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams; // ✅ await here
  const query = q || "";
  const roadmapsPromise = getRoadmaps(query);

  return (
    <main className="w-full max-w-7xl mx-auto md:p-8">
      <div className="flex justify-between  mb-4 md:mb-10 md:flex-row flex-col gap-4 items-start">
        <h2 className="text-4xl font-bold flex flex-col gap-2">
          My Roadmaps
          <span className="text-muted-foreground text-sm font-normal">
            Refresh your knowledge or learn something new.
          </span>
        </h2>
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
