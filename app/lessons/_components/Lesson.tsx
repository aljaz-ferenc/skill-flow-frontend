"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import ExerciseComponent from "@/app/lessons/_components/Exercise";
import { Button } from "@/components/ui/button";
import { generateLesson } from "@/lib/actions";
import type { Lesson as TLesson } from "@/lib/types";

type LessonProps = {
  lessons: TLesson[];
  roadmapId: string;
  conceptId: string;
  roadmapTitle: string;
  sectionTitle: string;
  conceptTitle: string;
};

export default function Lesson({
  lessons,
  conceptTitle,
  roadmapTitle,
  sectionTitle,
  roadmapId,
  conceptId,
}: LessonProps) {
  const [currentLesson, setCurrentLesson] = useState<TLesson>();
  const [type, setType] = useState<"lesson" | "exercise">("lesson");

  function onBack() {
    if (type === "exercise") {
      setType("lesson");
    }
  }

  function onNext() {
    if (type === "lesson") {
      setType("exercise");
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
    setCurrentLesson(current);
  }, [lessons, conceptTitle, conceptId, sectionTitle, roadmapTitle, roadmapId]);

  if (!currentLesson?.exercise || !currentLesson.content) return;

  return (
    <div className="prose max-w-4xl mx-auto h-screen flex flex-col justify-between">
      <div className="overflow-y-auto h-full">
        {type === "lesson" ? (
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePrism]}>
            {currentLesson.content}
          </Markdown>
        ) : (
          <ExerciseComponent
            exercise={currentLesson.exercise}
            lessonContent={currentLesson.content}
          />
        )}
      </div>
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
