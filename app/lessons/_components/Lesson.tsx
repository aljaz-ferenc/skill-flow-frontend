"use client";

import { ArrowLeft, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import ExerciseComponent from "@/app/lessons/_components/Exercise";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  completeConcept,
  completeLesson,
  generateLesson,
  planLessons,
  unlockConcept,
  unlockLesson,
} from "@/lib/actions";
import type { ConceptMeta, Lesson as TLesson } from "@/lib/types";

type LessonProps = {
  lessons: TLesson[];
  roadmapTitle: string;
  sectionTitle: string;
  conceptTitle: string;
  nextConcept: ConceptMeta | null;
};

export default function Lesson({
  lessons,
  conceptTitle,
  roadmapTitle,
  sectionTitle,
  nextConcept,
}: LessonProps) {
  const [type, setType] = useState<"lesson" | "exercise">("lesson");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const sectionId = params.get("sectionId") as string;
  const roadmapId = params.get("roadmapId") as string;
  const conceptId = params.get("conceptId") as string;
  const lessonId = params.get("lessonId") as string;
  const currentLesson = lessons.find((l) => l._id === lessonId);
  const currentIndex = lessons.findIndex((l) => l._id === currentLesson?._id);

  function onBack() {
    router.push(`/dashboard/roadmaps/${roadmapId}`);
  }

  async function onNextLesson() {
    const nextLessonIndex = lessons.findIndex((l) => l._id === lessonId) + 1;
    if (nextLessonIndex < 0 || !lessons[currentIndex + 1]?._id) {
      if (nextConcept) {
        completeConcept({ roadmapId, sectionId, conceptId });
        if (!nextConcept) return; //TODO: unlock next section if just finished last concept in current section
        await planLessons({
          roadmap_topic: roadmapTitle,
          section_title: sectionTitle,
          concept_title: nextConcept.title,
          concept_id: nextConcept._id,
          roadmap_id: roadmapId,
          section_id: sectionId,
        });
        await unlockConcept({
          roadmapId,
          conceptId: nextConcept._id,
          sectionId,
        });
      } else {
        /// unlock next section
      }
      return router.push(`/dashboard/roadmaps/${roadmapId}`);
    }

    router.push(
      `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lessons[currentIndex + 1]._id}`,
    );
  }

  useEffect(() => {
    // If we're already generating or have content, do nothing
    if (isGenerating || currentLesson?.content) return;

    // If we have a lessonId but no content, generate for that specific lesson
    if (lessonId && !currentLesson?.content) {
      setIsGenerating(true);
      generateLesson({
        conceptTitle,
        roadmapTitle,
        roadmapId,
        conceptId,
        sectionTitle,
        lessonId,
      })
        .then((lesson) => {
          if (!lesson?.lesson_id) return;
          unlockLesson(lesson.lesson_id);
        })
        .finally(() => setIsGenerating(false));
      return;
    }

    // If no current lesson with content, find the first locked lesson
    const current = lessons.find((l) => l.status === "current");
    if (!current || !current.content) {
      const firstLockedLesson = lessons.find((l) => l.status === "locked");

      if (!firstLockedLesson) {
        router.push(
          `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lessons[0]._id}`,
        );
        return;
      }

      setIsGenerating(true);
      generateLesson({
        conceptTitle,
        roadmapTitle,
        roadmapId,
        conceptId,
        sectionTitle,
        lessonId: firstLockedLesson._id.toString(),
      })
        .then((lesson) => {
          if (!lesson?.lesson_id) return;
          unlockLesson(lesson.lesson_id);
        })
        .finally(() => setIsGenerating(false));
    }
  }, [
    lessons,
    conceptTitle,
    lessonId,
    conceptId,
    sectionTitle,
    roadmapTitle,
    roadmapId,
    router,
    sectionId,
    isGenerating, // Add this dependency
    currentLesson?.content, // Add this dependency
  ]);

  useEffect(() => {
    if (!lessonId) return;
    setType("lesson");
  }, [lessonId]);

  if (!currentLesson) return;

  async function onAnswerCorrect() {
    const currentIndex = lessons.findIndex((l) => l._id === currentLesson?._id);
    await completeLesson(lessonId);
    router.refresh();

    if (currentIndex < lessons.length - 1) {
      if (!lessons[currentIndex + 1].content) {
        setIsGenerating(true);
        generateLesson({
          conceptTitle,
          roadmapTitle,
          roadmapId,
          conceptId,
          sectionTitle,
          lessonId: lessons[currentIndex + 1]._id.toString(),
        }).finally(() => setIsGenerating(false));
      } else {
        router.push(
          `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lessons[currentIndex + 1]._id}`,
        );
      }
    }
  }

  if (!currentLesson?.exercises || !currentLesson.content) return;

  function getReadingTime(content: string, exerciseCount: number): number {
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200)) + exerciseCount;
  }

  return (
    <div className=" max-w-screen w-full mx-auto h-screen pb-12 py-12 flex flex-col justify-between p-3 bg-background  max-h-screen overflow-y-auto">
      {!isGenerating ? (
        <div className=" h-full w-full  max-w-7xl mx-auto">
          <section>
            <h3 className="text-muted-foreground mb-1">{roadmapTitle}</h3>
            <h4 className="text-3xl font-bold mb-4">{conceptTitle}</h4>
            <div className="flex gap-1 items-center justify-between text-muted-foreground mb-6">
              <span className="flex items-center gap-2">
                <Clock size={15} />
                <p>
                  {getReadingTime(
                    currentLesson.content,
                    currentLesson.exercises.length,
                  )}{" "}
                  min
                </p>
              </span>
              <Button variant={"link"} onClick={onBack}>
                <ArrowLeft />
                Back
              </Button>
            </div>
            {type === "lesson" ? (
              <>
                <Card className="dark:prose-invert prose max-w-7xl mx-auto">
                  <CardContent className="">
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypePrism]}
                    >
                      {currentLesson.content}
                    </Markdown>
                  </CardContent>
                </Card>
                {currentLesson.status === "current" && (
                  <Card className="mt-14 max-w-7xl mx-auto">
                    <CardContent>
                      <CardTitle className="mb-1">
                        Ready to Test Your Knowledge?
                      </CardTitle>
                      <CardDescription className="mb-4">
                        Complete the quiz to verify your understanding and mark
                        this lesson as complete.
                      </CardDescription>
                      <Button
                        className="cursor-pointer"
                        onClick={() => setType("exercise")}
                      >
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <ExerciseComponent
                onAnswerCorrectAction={onAnswerCorrect}
                exercises={currentLesson.exercises}
                lesson={currentLesson}
                onBackToLessonAction={() => setType("lesson")}
                onNextLessonAction={onNextLesson}
              />
            )}
          </section>
        </div>
      ) : (
        <div>Generating Lesson...</div>
      )}
    </div>
  );
}
