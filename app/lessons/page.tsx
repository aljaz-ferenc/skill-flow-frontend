import { Circle, CircleCheck, CircleDot } from "lucide-react";
import Lesson from "@/app/lessons/_components/Lesson";
import {
  generateLesson,
  getLessonsByConceptId,
  getRoadmap,
} from "@/lib/actions";

export default async function LessonsPage(props: PageProps<"/lessons">) {
  const { roadmapId, sectionId, conceptId } = await props.searchParams;
  if (!roadmapId || !sectionId || !conceptId) throw new Error("404 Not Found");

  const lessons = await getLessonsByConceptId(conceptId as string);
  const roadmap = await getRoadmap(roadmapId as string);
  const section = roadmap.sections.find((s) => s._id === sectionId);
  const concept = section?.concepts.find((c) => c._id === conceptId);

  if (!section || !concept) throw new Error("Section or concept not found.");

  const lessonsMeta = concept.lessons;
  if (!lessonsMeta || lessonsMeta.length === 0)
    throw new Error("No lessons found");

  return (
    <main className="flex min-h-screen  max-w-screen overflow-x-hidden">
      <aside className="p-2">
        <h3 className="text-xl font-bold mb-2">{concept.title}</h3>
        {lessons.map((lesson, index) => (
          <div
            className="flex gap-2 justify-start items-center"
            key={`${index + 1}`}
          >
            {lesson.status === "locked" && (
              <Circle size={12} className="!w-12 text-gray-500" />
            )}
            {lesson.status === "current" && (
              <CircleDot size={12} className="w-12 text-amber-400" />
            )}
            {lesson.status === "completed" && (
              <CircleCheck size={12} className="w-12 text-blue-500" />
            )}
            <h4 className="w-full">{lesson.title}</h4>
          </div>
        ))}
      </aside>
      <Lesson
        lessons={lessons}
        roadmapId={roadmapId as string}
        conceptId={conceptId as string}
        conceptTitle={concept.title}
        roadmapTitle={roadmap.topic}
        sectionTitle={section.title}
      />
    </main>
  );
}
