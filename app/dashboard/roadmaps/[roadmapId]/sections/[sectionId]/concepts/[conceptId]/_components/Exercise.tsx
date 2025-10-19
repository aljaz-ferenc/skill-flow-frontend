"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { checkAnswer } from "@/lib/actions";
import type { AnswerResult, Exercise } from "@/lib/types";
import { cn } from "@/lib/utils";

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
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAnswerResult(null);
    const result = await checkAnswer({
      question: exercise.exercise.question,
      answer: values.answer,
      lessonContent,
    });
    setAnswerResult(result);
  }

  if (exercise.type === "question") {
    return (
      <article className="w-full max-w-4xl pt-20 prose mx-auto">
        <h1>Exercise</h1>
        <p>{exercise.exercise.question}</p>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="answer"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="answer">Answer</FieldLabel>
                <Textarea
                  {...field}
                  id="answer"
                  placeholder="Type your answer here..."
                  autoComplete="off"
                  autoCorrect="off"
                  className="ml-1"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            className="mt-2"
            type="submit"
            disabled={answerResult?.is_correct}
          >
            Check Answer
          </Button>
        </form>
        {answerResult && (
          <div className="prose w-full max-w-4xl mt-10">
            <p
              className={cn(
                "text-xl font-bold",
                answerResult.is_correct ? "text-green-500" : "text-destructive",
              )}
            >
              {answerResult.is_correct ? "Correct!" : "Incorrect!"}
            </p>
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePrism]}>
              {answerResult.additional_explanation}
            </Markdown>
          </div>
        )}
      </article>
    );
  }

  //TODO add forms for other types of exercises

  return null;
}
