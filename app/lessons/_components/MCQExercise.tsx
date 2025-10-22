import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@/lib/types";
import { cn } from "@/lib/utils";

type MCQExerciseProps = {
  exercise: Exercise;
  clickedIndices: number[];
  setClickedIndices: Dispatch<SetStateAction<number[]>>;
  onAnswerCorrect: () => void;
};

export default function MCQExercise({
  exercise,
  clickedIndices,
  setClickedIndices,
  onAnswerCorrect,
}: MCQExerciseProps) {
  if (exercise.type !== "mcq") return;

  function onGuess(answerIndex: number) {
    if (exercise.type === "mcq") {
      const isCorrect = answerIndex === exercise.exercise.answer_index;
      setClickedIndices((prev) => Array.from(new Set([...prev, answerIndex])));

      if (isCorrect) {
        onAnswerCorrect();
      }
    }
  }

  return (
    <article className="h-full flex items-center max-w-xl">
      <div className="h-min">
        <h4 className="mb-8 text-xl text-center">
          {exercise.exercise.question}
        </h4>
        <div className="flex flex-col gap-2">
          {exercise.exercise.answer_options.map((option, index) => (
            <Button
              type="button"
              className={cn(
                "cursor-pointer",

                clickedIndices.includes(index) &&
                  "bg-destructive pointer-events-none",

                clickedIndices.includes(index) &&
                  index === exercise.exercise.answer_index &&
                  "bg-green-500 pointer-events-none",
              )}
              key={option}
              variant="secondary"
              onClick={() => onGuess(index)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </article>
  );
}
