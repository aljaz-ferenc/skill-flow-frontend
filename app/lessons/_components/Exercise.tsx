"use client";

import { useState } from "react";
import MCQExercise from "@/app/lessons/_components/MCQExercise";
import QuestionExercise from "@/app/lessons/_components/QuestionExercise";
import type { Exercise } from "@/lib/types";

type ExerciseProps = {
  exercise: Exercise;
  lessonContent: string;
  onAnswerCorrectAction: () => void;
};

export default function ExerciseComponent({
  exercise,
  lessonContent,
  onAnswerCorrectAction,
}: ExerciseProps) {
  const [clickedIndices, setClickedIndices] = useState<number[]>([]);

  if (exercise.type === "question") {
    return (
      <QuestionExercise exercise={exercise} lessonContent={lessonContent} />
    );
  }

  if (exercise.type === "mcq") {
    return (
      <MCQExercise
        onAnswerCorrect={onAnswerCorrectAction}
        exercise={exercise}
        setClickedIndices={setClickedIndices}
        clickedIndices={clickedIndices}
      />
    );
  }
  return null;
}
