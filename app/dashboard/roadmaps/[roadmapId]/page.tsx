import { getRoadmap } from "@/lib/actions";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ roadmapId: string }>;
}) {
  const { roadmapId } = await params;
  const roadmap = await getRoadmap(roadmapId);
  console.log("ROADMAP: ", roadmap);

  return <div>ROADMAP: {roadmapId}</div>;
}
