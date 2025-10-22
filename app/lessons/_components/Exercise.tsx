"use client";

import { useState } from "react";
import { z } from "zod";
import MCQExercise from "@/app/lessons/_components/MCQExercise";
import QuestionExercise from "@/app/lessons/_components/QuestionExercise";
import type { AnswerResult, Exercise } from "@/lib/types";

type ExerciseProps = {
  exercise: Exercise;
  lessonContent: string;
};

const formSchema = z.object({
  answer: z.string().min(3, { error: "Type at least 3 characters" }),
});

export default function ExerciseComponent({
  exercise,
  lessonContent,
}: ExerciseProps) {
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [clickedIndices, setClickedIndices] = useState<number[]>([]);

  if (exercise.type === "question") {
    return (
      <QuestionExercise exercise={exercise} lessonContent={lessonContent} />
    );
  }

  if (exercise.type === "mcq") {
    return (
      <MCQExercise
        exercise={exercise}
        setClickedIndices={setClickedIndices}
        clickedIndices={clickedIndices}
      />
    );
  }
  return null;
}
