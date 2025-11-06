import type { Roadmap } from "@/lib/types";

export const dynamic = "force-dynamic";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import RoadmapAccordion from "@/app/dashboard/roadmaps/[roadmapId]/_components/RoadmapAccordion";
import RoadmapSkeleton from "@/app/dashboard/roadmaps/[roadmapId]/_components/RoadmapSkeleton";
import { getRoadmap } from "@/lib/actions";
import { getRoadmapProgressPercentage } from "@/lib/utils";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ roadmapId: string }>;
}) {
  const { roadmapId } = await params;
  const roadmapPromise = getRoadmap(roadmapId);

  return (
    <main className="w-full flex flex-col gap-10 max-w-4xl mx-auto md:p-8">
      <Link
        href="/dashboard/roadmaps"
        className="text-sm ml-auto flex gap-2 items-center text-primary"
      >
        <ArrowLeft size={12} />
        Back to Roadmaps
      </Link>
      <Suspense fallback={<RoadmapSkeleton sectionsCount={6} />}>
        <RoadmapWrapper roadmapPromise={roadmapPromise} />
      </Suspense>
    </main>
  );
}

async function RoadmapWrapper({
  roadmapPromise,
}: {
  roadmapPromise: Promise<Roadmap>;
}) {
  const roadmap = await roadmapPromise;
  if (!roadmap) throw new Error("Roadmap not found");

  return (
    <>
      <h3 className="md:text-4xl text-2xl font-bold">{roadmap.topic}</h3>
      <div className="gap-6 justify-between items-center">
        <p className="text-base font-medium leading-normal">Progress</p>
        <p className="text-sm font-normal leading-normal">
          {getRoadmapProgressPercentage(roadmap)}%
        </p>
        <div className="rounded-full bg-secondary w-full">
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: `${getRoadmapProgressPercentage(roadmap)}%` }}
          ></div>
        </div>
      </div>
      <RoadmapAccordion sections={roadmap.sections} roadmapId={roadmap._id} />
    </>
  );
}
