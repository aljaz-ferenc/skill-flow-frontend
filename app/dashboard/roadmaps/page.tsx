import RoadmapCard from "@/app/dashboard/roadmaps/_components/RoadmapCard";
import { getRoadmaps } from "@/lib/actions";

export default async function RoadmapsPage() {
  const roadmaps = await getRoadmaps();
  console.log(roadmaps);
  return (
    <div className="flex flex-wrap gap-5">
      {roadmaps?.map((roadmap) => (
        <RoadmapCard roadmap={roadmap} key={roadmap._id.toString()} />
      ))}
    </div>
  );
}
