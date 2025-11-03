"use client";

import { ArrowLeft, CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import MCQExercise from "@/app/lessons/_components/MCQExercise";
import QuestionExercise from "@/app/lessons/_components/QuestionExercise";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Exercise, Lesson } from "@/lib/types";
import { cn } from "@/lib/utils";

type ExerciseProps = {
  exercises: Exercise[];
  lesson: Lesson;
  onAnswerCorrectAction: () => void;
  onBackToLessonAction: () => void;
  onNextLessonAction: () => void;
  onCompleteConceptAction: () => void;
  isLessonFinal: boolean;
};

export default function ExerciseComponent({
  exercises,
  lesson,
  onAnswerCorrectAction,
  onBackToLessonAction,
  onNextLessonAction,
  onCompleteConceptAction,
  isLessonFinal,
}: ExerciseProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const currentExercise = exercises[currentExerciseIndex];
  const [results, setResults] = useState<boolean[]>([]);
  const [exercisesCompleted, setExercisesCompleted] = useState(false);
  const correctCount = results.filter((r) => Boolean(r)).length;
  const resultPercentage = (correctCount / exercises.length) * 100;
  const passTreshold = 70;
  const passed = resultPercentage >= passTreshold;

  function onAnswer(isCorrect: boolean) {
    setResults((prev) => [...prev, isCorrect]);
  }

  function onNextLesson() {
    onNextLessonAction();
    resetQuiz();
  }

  function completeLesson() {
    if (!isLessonFinal) {
      return onNextLesson();
    } else {
      onCompleteConceptAction();
    }
  }

  function resetQuiz() {
    setCurrentExerciseIndex(0);
    setResults([]);
    setExercisesCompleted(false);
  }

  function onNextExercise() {
    if (!exercises[currentExerciseIndex + 1]) {
      setExercisesCompleted(true);
      // if (passed) {
      //   completeLesson(lesson._id);
      // }

      return;
    }
    setCurrentExerciseIndex((prev) => prev + 1);
  }

  if (exercisesCompleted) {
    return (
      <>
        <Button
          onClick={onBackToLessonAction}
          variant={"link"}
          className="flex gap-2 items-center ml-auto mb-4"
        >
          <ArrowLeft />
          Back to Lesson
        </Button>
        <Card
          className={cn(
            "border border-transparent",
            passed
              ? "bg-green-100 border-green-500"
              : "bg-red-100 border-red-500",
          )}
        >
          <CardContent>
            <CardTitle className="flex gap-4 items-center">
              {passed ? (
                <CircleCheck size={30} color="green" />
              ) : (
                <CircleX size={30} color="red" />
              )}
              <div>
                <p className="text-xl">
                  {passed ? "Congratulations!" : "Keep learning!"}
                </p>
                <p className="text-muted-foreground font-light text-sm">
                  You scored {correctCount} out of {exercises.length} (
                  {Math.round(resultPercentage)}%)
                </p>
              </div>
            </CardTitle>
            {passed ? (
              <p className="mt-6 text-muted-foreground text-sm">
                Great job! You've demonstrated a solid understanding of the
                lesson <strong>{lesson.title}</strong>. You can now move on to
                the next lesson.
              </p>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">
                You need at least <strong>{passTreshold}%</strong> to pass.
                Review the lesson content and try again to strengthen your
                understanding.
              </p>
            )}
          </CardContent>
        </Card>
        {passed ? (
          <Button className="mt-4 cursor-pointer" onClick={completeLesson}>
            Complete Lesson
          </Button>
        ) : (
          <Button className="mt-4" onClick={resetQuiz}>
            Retake Quiz
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between max-w-4xl mx-auto">
        <Badge className="h-6">
          Question {currentExerciseIndex + 1} of {exercises.length}
        </Badge>
        <Button
          onClick={onBackToLessonAction}
          variant={"link"}
          className="flex gap-2 items-center"
        >
          <ArrowLeft />
          Back to Lesson
        </Button>
      </div>
      {currentExercise.type === "question" && (
        <QuestionExercise
          exercise={currentExercise}
          lesson={lesson}
          onAnswerCorrectAction={onAnswerCorrectAction}
          onNextExerciseAction={onNextExercise}
          onAnswerAction={onAnswer}
        />
      )}

      {currentExercise.type === "mcq" && (
        <MCQExercise
          onAnswerAction={onAnswer}
          onAnswerCorrect={onAnswerCorrectAction}
          exercise={currentExercise}
          onNextExerciseAction={onNextExercise}
        />
      )}
    </>
  );
}
