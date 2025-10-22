import { Circle, CircleCheck, CircleDot } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Lesson from "@/app/lessons/_components/Lesson";
import { buttonVariants } from "@/components/ui/button";
import { getLessonsByConceptId, getRoadmap } from "@/lib/actions";
import { cn, getStatusColor } from "@/lib/utils";

export default async function LessonsPage(props: PageProps<"/lessons">) {
  const { roadmapId, sectionId, conceptId, lessonId } =
    await props.searchParams;
  if (!roadmapId || !sectionId || !conceptId) throw new Error("404 Not Found");

  const lessons = await getLessonsByConceptId(conceptId as string);

  function gotoLesson(lessonId: string) {
    redirect(
      `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lessonId}`,
    );
  }

  if (!lessonId) {
    const currentLesson = lessons.find((l) => l.status === "current");
    if (!currentLesson) {
      console.log("no current lesson");
      return;
    }
    gotoLesson(currentLesson._id);
  }

  const roadmap = await getRoadmap(roadmapId as string);
  const section = roadmap.sections.find((s) => s._id === sectionId);
  const concept = section?.concepts.find((c) => c._id === conceptId);

  if (!section || !concept) throw new Error("Section or concept not found.");

  const lessonsMeta = concept.lessons;
  if (!lessonsMeta || lessonsMeta.length === 0)
    throw new Error("No lessons found");

  return (
    <main className="flex min-h-screen  max-w-screen overflow-x-hidden">
      <aside className="p-2 flex flex-col justify-between bg-secondary">
        <h3 className="text-xl font-bold mb-2">{concept.title}</h3>
        <div>
          {lessons.map((lesson, index) => (
            <Link
              href={`/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lesson._id}`}
              type="button"
              className={cn(
                "flex gap-2 justify-start items-center cursor-pointer py-2",
                lesson.status === "locked" && "pointer-events-none",
                lesson._id.toString() === lessonId && "bg-accent rounded-md",
                `text-${getStatusColor(lesson.status)}`,
              )}
              key={`${index + 1}`}
            >
              {lesson.status === "locked" && (
                <Circle
                  size={15}
                  className={cn(
                    "!w-15",
                    `text-${getStatusColor(lesson.status)}`,
                  )}
                />
              )}
              {lesson.status === "current" && (
                <CircleDot
                  size={15}
                  className={cn(
                    "w-15",
                    `text-${getStatusColor(lesson.status)}`,
                  )}
                />
              )}
              {lesson.status === "completed" && (
                <CircleCheck
                  size={15}
                  className={cn(
                    "w-15",
                    `text-${getStatusColor(lesson.status)}`,
                  )}
                />
              )}
              <h4 className={cn("w-full")}>{lesson.title}</h4>
            </Link>
          ))}
        </div>
        <Link
          href="/dashboard/roadmaps"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full mt-auto",
          )}
        >
          Roadmaps
        </Link>
      </aside>
      <Lesson
        lessons={lessons}
        conceptTitle={concept.title}
        roadmapTitle={roadmap.topic}
        sectionTitle={section.title}
      />
    </main>
  );
}
