"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import ExerciseComponent from "@/app/lessons/_components/Exercise";
import { Button } from "@/components/ui/button";
import { completeLesson, generateLesson } from "@/lib/actions";
import type { Lesson as TLesson } from "@/lib/types";

type LessonProps = {
  lessons: TLesson[];
  roadmapTitle: string;
  sectionTitle: string;
  conceptTitle: string;
};

export default function Lesson({
  lessons,
  conceptTitle,
  roadmapTitle,
  sectionTitle,
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
    if (type === "exercise") {
      setType("lesson");
    } else {
      router.push(
        `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lessons[currentIndex - 1]._id}`,
      );
    }
  }

  function onNext() {
    // skip exercise if lesson is completed
    if (type === "lesson" && currentLesson?.status !== "completed") {
      setType("exercise");
    } else {
      if (!lessons[currentIndex + 1]?._id) {
        return router.push(`/dashboard/roadmaps/${roadmapId}`);
      }
      router.push(
        `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lessons[currentIndex + 1]._id}`,
      );
    }
  }

  useEffect(() => {
    const current = lessons.find((l) => l.status === "current");

    if (!current) {
      if (lessons.every((l) => l.status === "completed")) return;
      generateLesson({
        conceptTitle,
        roadmapTitle,
        roadmapId,
        conceptId,
        sectionTitle,
        lessonId: lessons[0]._id.toString(),
      });
      return;
    }
  }, [lessons, conceptTitle, conceptId, sectionTitle, roadmapTitle, roadmapId]);

  useLayoutEffect(() => {
    if (!lessonId) return;
    setType("lesson");
  }, [lessonId]);

  if (!currentLesson) return;

  async function onAnswerCorrect() {
    const currentIndex = lessons.findIndex((l) => l._id === currentLesson?._id);
    await completeLesson(lessonId);

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
        })
          .then(() =>
            router.push(
              `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lessons[currentIndex + 1]._id}`,
            ),
          )
          .finally(() => setIsGenerating(false));
      } else {
        router.push(
          `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lessons[currentIndex + 1]._id}`,
        );
      }
    }
  }

  if (!currentLesson?.exercise || !currentLesson.content) return;

  return (
    <div className="prose dark:prose-invert max-w-4xl mx-auto h-screen flex flex-col justify-between p-3 bg-background">
      {!isGenerating ? (
        <div className="overflow-y-auto h-full">
          {type === "lesson" ? (
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePrism]}>
              {currentLesson.content}
            </Markdown>
          ) : (
            <ExerciseComponent
              onAnswerCorrect={onAnswerCorrect}
              exercise={currentLesson.exercise}
              lessonContent={currentLesson.content}
            />
          )}
        </div>
      ) : (
        <div>Generating Lesson...</div>
      )}
      <div>
        <hr />
        <div className="flex justify-between max-w-4xl w-full mx-auto my-10 cursor-pointer">
          <Button
            onClick={onBack}
            className="flex items-center"
            variant="ghost"
          >
            <ArrowLeft />
            <span>Back</span>
          </Button>
          <Button
            onClick={onNext}
            className="flex items-center cursor-pointer"
            variant="ghost"
          >
            <span>Next</span>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
