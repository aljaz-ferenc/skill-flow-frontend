"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import ExerciseComponent from "@/app/dashboard/roadmaps/[roadmapId]/sections/[sectionId]/concepts/[conceptId]/_components/Exercise";
import { Button } from "@/components/ui/button";
import type { Exercise, Lesson as TLesson } from "@/lib/types";

type LessonProps = {
  lessons: TLesson[];
};

export default function Lesson({ lessons }: LessonProps) {
  const [currentLesson, setCurrentLesson] = useState(lessons.length - 1);
  const lesson = lessons.at(currentLesson);
  const [type, setType] = useState<"lesson" | "exercise">("lesson");

  function onNext() {
    setType((prev) => (prev === "lesson" ? "exercise" : "lesson"));
  }

  function onPrev() {
    setType((prev) => (prev === "exercise" ? "lesson" : "exercise"));
  }

  return (
    <section className="w-full h-full overflow-y-auto flex flex-col justify-between">
      {type === "lesson" ? (
        <article className="prose mx-auto h-full w-full max-w-4xl pt-20">
          {lesson && (
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePrism]}>
              {lesson.content}
            </Markdown>
          )}
        </article>
      ) : (
        <ExerciseComponent
          lessonContent={lesson!.content}
          exercise={lesson!.exercise as Exercise}
        />
      )}
      <hr className="mt-5" />
      <div className="flex justify-between max-w-4xl w-full mx-auto my-10 cursor-pointer">
        <Button onClick={onPrev} className="flex items-center" variant="ghost">
          <ArrowLeft />
          <span>Previous</span>
        </Button>
        {type === "lesson" && (
          <Button
            onClick={onNext}
            className="flex items-center cursor-pointer"
            variant="ghost"
          >
            <span>Next</span>
            <ArrowRight />
          </Button>
        )}
      </div>
    </section>
  );
}
