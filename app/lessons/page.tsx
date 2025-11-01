export const dynamic = "force-dynamic";

import { Circle, CircleCheck, CircleDot } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Lesson from "@/app/lessons/_components/Lesson";
import { buttonVariants } from "@/components/ui/button";
import { getLessonsByConceptId, getRoadmap, planLessons } from "@/lib/actions";
import type { Lesson as TLesson } from "@/lib/types";
import { cn, getStatusColor } from "@/lib/utils";

export default async function LessonsPage(props: PageProps<"/lessons">) {
  const { roadmapId, sectionId, conceptId, lessonId } =
    await props.searchParams;
  if (!roadmapId || !sectionId || !conceptId) throw new Error("404 Not Found");

  const roadmap = await getRoadmap(roadmapId as string);
  const section = roadmap.sections.find((s) => s._id === sectionId);
  const concept = section?.concepts.find((c) => c._id === conceptId);

  let lessons: TLesson[] = [];

  if (!roadmap || !concept || !section) {
    throw new Error("Roadmap, concept or section not found");
  }

  if (lessonId) {
    lessons = await getLessonsByConceptId(conceptId as string);

    if (lessons.length === 0) {
      await planLessons({
        roadmap_id: String(roadmap._id),
        roadmap_topic: roadmap.topic,
        section_id: String(sectionId),
        section_title: section.title,
        concept_id: String(conceptId),
        concept_title: concept.title,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      lessons = await getLessonsByConceptId(conceptId as string);

      if (lessons.length === 0) {
        throw new Error("Failed to generate lessons");
      }
    }
  }

  if (!lessonId) {
    const currentLesson = concept.lessons.find((l) => l.status === "current");
    const firstLesson = concept.lessons[0];

    if (currentLesson) {
      redirect(
        `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${currentLesson._id}`,
      );
    } else if (firstLesson) {
      redirect(
        `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${firstLesson._id}`,
      );
    } else {
      console.log("CONCEPT: ", concept.lessons.length);
      await planLessons({
        roadmap_id: String(roadmap._id),
        roadmap_topic: roadmap.topic,
        section_id: section._id,
        section_title: section.title,
        concept_id: concept._id,
        concept_title: concept.title,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      lessons = await getLessonsByConceptId(conceptId as string);
    }
  }

  const conceptIndex = section.concepts.findIndex((c) => c._id === conceptId);
  const nextConcept = section.concepts[conceptIndex + 1] || null;

  const sectionIndex = roadmap.sections.findIndex((s) => s._id === sectionId);
  const nextSection = roadmap.sections[sectionIndex + 1] || null;

  return (
    <main className="flex min-h-screen overflow-x-hidden">
      <aside className="p-4 flex flex-col justify-between bg-secondary">
        <h3 className="text-xl font-bold mb-2">{concept.title}</h3>
        <div className="w-60">
          {lessons.map((lesson) => {
            if (lesson.status === "locked") {
              return (
                <div
                  key={lesson._id}
                  className="flex justify-start items-center py-2 text-left"
                >
                  {getStatusIcon(lesson.status)}
                  <h4
                    className={cn(
                      "w-full text-xs leading-4",
                      `text-${getStatusColor(lesson.status)}`,
                    )}
                  >
                    {lesson.title}
                  </h4>
                </div>
              );
            }
            return (
              <Link
                href={`/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lesson._id}`}
                type="button"
                className={cn(
                  "flex justify-start items-center cursor-pointer py-2",
                  lesson._id.toString() === lessonId && "bg-accent rounded-xs",
                  `text-${getStatusColor(lesson.status)}`,
                )}
                key={lesson._id}
              >
                {getStatusIcon(lesson.status)}
                <h4
                  className={cn(
                    "w-full text-xs leading-4",
                    `text-${getStatusColor(lesson.status)}`,
                  )}
                >
                  {lesson.title}
                </h4>
              </Link>
            );
          })}
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
        nextConcept={nextConcept}
        nextSection={nextSection}
        section={section}
      />
    </main>
  );
}

function getStatusIcon(status: "current" | "locked" | "completed") {
  switch (status) {
    case "completed":
      return (
        <CircleCheck
          size={16}
          className={cn("w-12", `text-${getStatusColor(status)}`)}
        />
      );
    case "current":
      return (
        <CircleDot
          size={16}
          className={cn("w-12", `text-${getStatusColor(status)}`)}
        />
      );
    case "locked":
      return (
        <Circle
          size={16}
          className={cn("!w-12", `text-${getStatusColor(status)}`)}
        />
      );
  }
}
