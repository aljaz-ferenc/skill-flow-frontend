"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { checkAnswer } from "@/lib/actions";
import type { AnswerResult, Exercise, Lesson } from "@/lib/types";
import { cn } from "@/lib/utils";

type QuestionExerciseProps = {
  exercise: Exercise;
  lesson: Lesson;
  onAnswerCorrectAction: () => void;
  onNextExerciseAction: () => void;
  onAnswerAction: (isCorrect: boolean) => void;
};

const formSchema = z.object({
  answer: z.string().min(3, { error: "Type at least 3 characters" }),
});

export default function QuestionExercise({
  exercise,
  lesson,
  onNextExerciseAction,
  onAnswerAction,
}: QuestionExerciseProps) {
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
    },
  });

  function onNextExercise() {
    onNextExerciseAction();
    setAnswerResult(null);
    form.reset();
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsChecking(true);
    setAnswerResult(null);
    const result = await checkAnswer({
      question: exercise.question,
      answer: values.answer,
      lessonContent: lesson.content || "",
    });
    onAnswerAction(result.is_correct);
    setAnswerResult(result);
    setIsChecking(false);
  }

  return (
    <article className="w-full max-w-4xl pt-20 prose dark:prose-invert mx-auto">
      <h1>Exercise</h1>
      <span className="text-lg font-semibold">
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePrism]}>
          {exercise.question}
        </Markdown>
      </span>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="answer"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Textarea
                disabled={isChecking}
                {...field}
                id="answer"
                placeholder="Type your answer here..."
                autoComplete="off"
                autoCorrect="off"
                className="ml-1 bg-white"
                spellCheck={false}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {!answerResult && (
          // biome-ignore lint/complexity/noUselessFragments: e
          <>
            {!isChecking ? (
              <Button className="mt-4" type="submit">
                Check Answer
              </Button>
            ) : (
              <Button
                className="mt-4 flex gap-2 items-center"
                type="button"
                disabled
              >
                <Bot /> Checking your answer...
              </Button>
            )}
          </>
        )}
      </form>
      {answerResult && (
        <div className="prose w-full max-w-4xl mt-10">
          {answerResult && (
            <Card
              className={cn(
                "prose dark:prose-invert max-w-4xl border border-transparent pt-0",
                answerResult.is_correct
                  ? "border-green-500 bg-green-100"
                  : "border-red-500 bg-red-100",
              )}
            >
              <CardContent>
                <CardTitle>
                  <h4
                    className={cn(
                      "text-xl font-bold flex gap-2 items-center",
                      answerResult.is_correct
                        ? "text-green-500"
                        : "text-destructive",
                    )}
                  >
                    {answerResult.is_correct ? <CircleCheck /> : <CircleX />}
                    {answerResult.is_correct ? "Correct!" : "Incorrect!"}
                  </h4>
                </CardTitle>
                <span className="prose dark:prose-invert text-sm">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypePrism]}
                  >
                    {answerResult.additional_explanation}
                  </Markdown>
                </span>
              </CardContent>
            </Card>
          )}
          {answerResult && (
            <Button
              onClick={onNextExercise}
              className="mt-4 cursor-pointer bg-green-500 hover:bg-green-400"
            >
              Next Exercise
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
