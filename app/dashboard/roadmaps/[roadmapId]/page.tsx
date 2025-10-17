import RoadmapAccordion from "@/app/dashboard/roadmaps/[roadmapId]/_components/RoadmapAccordion";
import { getRoadmap } from "@/lib/actions";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ roadmapId: string }>;
}) {
  const { roadmapId } = await params;
  const roadmap = await getRoadmap(roadmapId);

  return (
    <main className="w-full flex flex-col gap-10 max-w-4xl mx-auto">
      <h3 className="text-4xl font-bold">{roadmap.topic}</h3>
      <div className="gap-6 justify-between items-center">
        <p className="text-base font-medium leading-normal">Overall Progress</p>
        <p className="text-sm font-normal leading-normal">33%</p>
        <div className="rounded-full bg-[#325567] w-full">
          <div className="h-2 rounded-full bg-primary w-[33%]"></div>
        </div>
      </div>
      <RoadmapAccordion sections={roadmap.sections} roadmapId={roadmap._id} />
    </main>
  );
}
