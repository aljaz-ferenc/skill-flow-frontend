"use client";

import { AlertCircle, ArrowLeft, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import ExerciseComponent from "@/app/lessons/_components/Exercise";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  completeConcept,
  completeLesson,
  completeSection,
  generateLesson,
  planLessons,
  unlockConcept,
  unlockLesson,
  unlockSection,
} from "@/lib/actions";
import type { ConceptMeta, Section, Lesson as TLesson } from "@/lib/types";

type LessonProps = {
  lessons: TLesson[];
  roadmapTitle: string;
  sectionTitle: string;
  conceptTitle: string;
  nextConcept: ConceptMeta | null;
  nextSection: Section;
  section: Section;
};

export default function Lesson({
  lessons,
  conceptTitle,
  roadmapTitle,
  sectionTitle,
  nextConcept,
  nextSection,
  section,
}: LessonProps) {
  const [type, setType] = useState<"lesson" | "exercise">("lesson");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFinishingConcept, setIsFinishingConcept] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const sectionId = params.get("sectionId") as string;
  const roadmapId = params.get("roadmapId") as string;
  const conceptId = params.get("conceptId") as string;
  const lessonId = params.get("lessonId") as string;
  const currentLesson = lessons.find((l) => l._id === lessonId);
  const currentIndex = lessons.findIndex((l) => l._id === currentLesson?._id);
  const isFinal =
    lessons.findIndex((l) => l._id === lessonId) === lessons.length - 1;
  const [error, setError] = useState("");

  function onBack() {
    router.push(`/dashboard/roadmaps/${roadmapId}`);
  }

  async function onCompleteConcept() {
    setIsFinishingConcept(true);
    await completeLesson(lessonId);
    await completeConcept({ conceptId, sectionId, roadmapId });

    // if last concept in last section
    if (!nextConcept && !nextSection) {
      await completeSection({ roadmapId, sectionId });
    }

    // if last concept in section - complete section,  unlock next concept and next section, plan lessons for unlocked concept
    if (!nextConcept) {
      await completeSection({ roadmapId, sectionId });
      await unlockSection({ roadmapId, sectionId: nextSection._id });
      await unlockConcept({
        roadmapId,
        sectionId: nextSection._id,
        conceptId: nextSection.concepts[0]._id,
      });
      await planLessons({
        roadmap_topic: roadmapTitle,
        roadmap_id: roadmapId,
        concept_title: nextSection.concepts[0].title,
        section_title: nextSection.title,
        concept_id: nextSection.concepts[0]._id,
        section_id: nextSection._id,
      });
    }

    // if not last concept in section
    if (nextConcept) {
      await unlockConcept({ conceptId: nextConcept._id, sectionId, roadmapId });
      await planLessons({
        roadmap_topic: roadmapTitle,
        roadmap_id: roadmapId,
        concept_title: nextConcept.title,
        section_title: section.title,
        concept_id: nextConcept._id,
        section_id: nextSection._id,
      });
    }
    setIsFinishingConcept(false);

    return router.push(`/dashboard/roadmaps/${roadmapId}`);
  }

  async function onNextLesson() {
    setIsGenerating(true);
    const nextLessonIndex = lessons.findIndex((l) => l._id === lessonId) + 1;

    await completeLesson(lessons[currentIndex]._id);

    if (nextLessonIndex < 0 || !lessons[currentIndex + 1]?._id) {
      await completeConcept({ roadmapId, sectionId, conceptId });
      return router.push(`/dashboard/roadmaps/${roadmapId}`);
    }

    router.push(
      `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lessons[currentIndex + 1]._id}`,
    );
  }

  useEffect(() => {
    if (lessonId && !currentLesson?.content) {
      console.log("GENERATING LESSON: ", lessonId, currentLesson?.content);
      setIsGenerating(true);
      setType("lesson");
      setError("");
      generateLesson({
        conceptTitle,
        roadmapTitle,
        roadmapId,
        conceptId,
        sectionTitle,
        lessonId,
      })
        .catch((err) => {
          console.log(err);
          setError(JSON.stringify(err));
        })
        .then((lesson) => {
          if (!lesson?.lesson_id) return;
          return unlockLesson(lesson.lesson_id).finally(() =>
            setIsGenerating(false),
          );
        });

      return;
    }
  }, [
    conceptTitle,
    lessonId,
    conceptId,
    sectionTitle,
    roadmapTitle,
    roadmapId,
    currentLesson?.content,
  ]);

  useEffect(() => {
    if (!lessonId) return;
    setType("lesson");
    setError("");
  }, [lessonId]);

  if (!currentLesson) return;

  async function onAnswerCorrect() {
    const currentIndex = lessons.findIndex((l) => l._id === currentLesson?._id);
    // await completeLesson(lessonId);
    router.refresh();

    if (currentIndex < lessons.length - 1) {
      if (!lessons[currentIndex + 1].content) {
        setIsGenerating(true);
        setError("");
        generateLesson({
          conceptTitle,
          roadmapTitle,
          roadmapId,
          conceptId,
          sectionTitle,
          lessonId: lessons[currentIndex + 1]._id.toString(),
        })
          .catch((err) => {
            console.log("Error generation lesson2: ", err);
            setError(JSON.stringify(err));
          })
          .finally(() => {
            setType("lesson");
            setIsGenerating(false);
          });
      } else {
        router.push(
          `/lessons?roadmapId=${roadmapId}&sectionId=${sectionId}&conceptId=${conceptId}&lessonId=${lessons[currentIndex + 1]._id}`,
        );
      }
    }
  }

  function onRetry() {
    setError("");
    setIsGenerating(true);
    generateLesson({
      conceptTitle,
      roadmapTitle,
      roadmapId,
      conceptId,
      sectionTitle,
      lessonId: lessons[currentIndex]._id.toString(),
    })
      .catch((err) => {
        console.log("Error generation lesson3: ", err);
        setError(JSON.stringify(err));
      })
      .finally(() => {
        setType("lesson");
        setIsGenerating(false);
      });
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <Card>
          <CardContent className="flex flex-col items-center">
            <AlertCircle size={30} color={"red"} />
            <p className="mt-4 text-sm text-muted-foreground mb-4 font-bold">
              Something went wrong generating lesson...
            </p>
            <Button onClick={onRetry} className="cursor-pointer">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isGenerating || isFinishingConcept) {
    const loadingText = isGenerating
      ? "Generating lesson..."
      : "Finishing things up...";
    return <LoadingScreen text={loadingText} />;
  }

  if (!currentLesson?.exercises || !currentLesson.content) return;

  function getReadingTime(content: string, exerciseCount: number): number {
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200)) + exerciseCount;
  }

  return (
    <div className="max-w-screen w-full mx-auto max-h-screen overflow-y-auto flex flex-col justify-between md:p-12 p-4 bg-background  ">
      <div className=" h-full w-full max-w-7xl mx-auto">
        <section>
          <div className="w-full">
            <Button variant={"link"} className="ml-auto flex" onClick={onBack}>
              <ArrowLeft />
              Back to Roadmap
            </Button>
          </div>
          <h4 className="text-3xl font-bold mb-4">{conceptTitle}</h4>
          <div className="flex gap-1 items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-2 mb-8">
              <Clock size={15} />
              <p>
                {getReadingTime(
                  currentLesson.content,
                  currentLesson.exercises.length,
                )}{" "}
                min
              </p>
            </span>
          </div>

          {type === "lesson" ? (
            <>
              <Card className="pt-0 mb-0 bg-transparent border-none shadow-none dark:prose-invert prose">
                <CardContent>
                  <CardTitle>
                    <h3 className="mt-0">{currentLesson.title}</h3>
                    <CardDescription>
                      <p>{currentLesson.description}</p>
                    </CardDescription>
                  </CardTitle>
                  <h4>Learning Objectives</h4>
                  <ul>
                    {currentLesson.learning_objectives.map((o) => (
                      <li className="text-sm" key={o}>
                        {o}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="max-w-7xl mx-auto md:mb-12 mb-6 dark:prose-invert prose text-sm">
                <CardContent className="">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypePrism]}
                  >
                    {currentLesson.content}
                  </Markdown>
                </CardContent>
              </Card>
              {currentLesson.status === "current" && (
                <Card className="max-w-7xl mx-auto">
                  <CardContent>
                    <CardTitle className="mb-1">
                      Ready to Test Your Knowledge?
                    </CardTitle>
                    <CardDescription className="mb-4">
                      Complete the quiz to verify your understanding and mark
                      this lesson as complete.
                    </CardDescription>
                    <Button
                      className="cursor-pointer"
                      onClick={() => setType("exercise")}
                    >
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <ExerciseComponent
              onAnswerCorrectAction={onAnswerCorrect}
              exercises={currentLesson.exercises}
              lesson={currentLesson}
              onBackToLessonAction={() => setType("lesson")}
              onNextLessonAction={onNextLesson}
              isLessonFinal={isFinal}
              onCompleteConceptAction={onCompleteConcept}
            />
          )}
        </section>
        <div className="h-12" />
      </div>
    </div>
  );
}
