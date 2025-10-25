import { useState } from "react";
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Exercise } from "@/lib/types";
import { cn } from "@/lib/utils";

type MCQExerciseProps = {
  exercise: Exercise;
  onAnswerCorrect: () => void;
  onAnswerAction: (isCorrect: boolean) => void;
  onNextExerciseAction: () => void;
};

export default function MCQExercise({
  exercise,
  onAnswerAction,
  onNextExerciseAction,
}: MCQExerciseProps) {
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
  const [answerIndex, setAnswerIndex] = useState<null | number>(null);
  if (exercise.type !== "mcq") return;

  const isGuessCorrect = selectedIndex === exercise.answer_index;

  function onCheckAnswer() {
    if (exercise.type === "mcq") {
      setAnswerIndex(selectedIndex);
      onAnswerAction(isGuessCorrect);
    }
  }

  function onNextExercise() {
    onNextExerciseAction();
    setAnswerIndex(null);
    setSelectedIndex(null);
  }

  return (
    <article className="h-full flex items-center max-w-4xl mx-auto flex-col gap-4">
      <Card className="h-min mx-auto w-full mt-12">
        <CardContent>
          <span className="text-lg font-semibold prose dark:prose-invert">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePrism]}>
              {exercise.question}
            </Markdown>
          </span>
          <p className="text-muted-foreground mb-4">
            Select the correct answer
          </p>
          <div className="flex flex-col gap-2">
            {exercise.answer_options.map((option, index) => (
              <div key={option}>
                <Label
                  className={cn(
                    "border text-md p-2 rounded border-transparent hover:bg-muted cursor-pointer",
                    answerIndex !== null &&
                      isGuessCorrect &&
                      index === answerIndex &&
                      "bg-green-100 border-green-500",
                    answerIndex !== null &&
                      !isGuessCorrect &&
                      index === answerIndex &&
                      "bg-red-100 border-red-500",
                    answerIndex !== null &&
                      index === exercise.answer_index &&
                      "bg-green-100 border-green-500",
                  )}
                >
                  <Checkbox
                    checked={selectedIndex === index}
                    onCheckedChange={() => setSelectedIndex(index)}
                    className="bg-white mr-2"
                    disabled={answerIndex !== null}
                  />
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypePrism]}
                  >
                    {option}
                  </Markdown>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {answerIndex === null ? (
        <Button
          onClick={onCheckAnswer}
          className="self-start cursor-pointer"
          disabled={selectedIndex === null}
        >
          Check Answer
        </Button>
      ) : (
        <Button onClick={onNextExercise} className="self-start cursor-pointer">
          Next Exercise
        </Button>
      )}
    </article>
  );
}
