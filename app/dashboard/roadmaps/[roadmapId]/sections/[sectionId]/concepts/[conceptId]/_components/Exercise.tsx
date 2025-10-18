import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Exercise } from "@/lib/types";

type ExerciseProps = {
  exercise: Exercise;
};

export default function ExerciseComponent({ exercise }: ExerciseProps) {
  if (exercise.type === "question") {
    return (
      <article className="w-full max-w-4xl pt-20 prose">
        <h1>Exercise</h1>
        <p>{exercise.exercise.question}</p>
        <Textarea className="ml-1" placeholder="Type your answer here..." />
        <Button className="mt-2">Check Answer</Button>
      </article>
    );
  }

  if (exercise.type === "mcq") {
    return (
      <article className="w-full max-w-4xl pt-20 prose">
        <h1>Exercise</h1>
        <p>{exercise.exercise.question}</p>
        <ul>
          {exercise.exercise.answerOptions.map(
            (option: string, index: number) => (
              <li key={index}>{option}</li>
            ),
          )}
        </ul>
      </article>
    );
  }

  return null;
}
