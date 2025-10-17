import { PlusCircle } from "lucide-react";
import RoadmapCard from "@/app/dashboard/roadmaps/_components/RoadmapCard";
import { getRoadmaps } from "@/lib/actions";

export default async function RoadmapsPage() {
  const roadmaps = await getRoadmaps();

  return (
    <main>
      <h2 className="text-4xl font-bold mb-10">My Roadmaps</h2>
      <div className="flex flex-wrap gap-5">
        <NewRoadmapCard />
        {roadmaps?.map((roadmap) => (
          <RoadmapCard roadmap={roadmap} key={roadmap._id.toString()} />
        ))}
      </div>
    </main>
  );
}

function NewRoadmapCard() {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center flex-col p-6 text-center">
      <span className="mb-3">
        <PlusCircle size={50} />
      </span>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
        Start New Roadmap
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Add a new topic to your learning path.
      </p>
    </div>
  );
}
