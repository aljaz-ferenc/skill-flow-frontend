import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { CiLock } from "react-icons/ci";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getLessonsByConceptId } from "@/lib/actions";
import type { Roadmap } from "@/lib/types";
import { cn, getSectionProgressPercentage } from "@/lib/utils";

type RoadmapAccordionProps = {
  sections: Roadmap["sections"];
  roadmapId: Roadmap["_id"];
};

export default function RoadmapAccordion({
  sections,
  roadmapId,
}: RoadmapAccordionProps) {
  return (
    <Accordion
      type="multiple"
      defaultValue={[sections.find((s) => s.status === "current")?.title || ""]}
    >
      {sections.map((section) => (
        <AccordionItem value={section.title} key={section.title}>
          <AccordionTrigger
            className={cn(
              "cursor-pointer flex items-center",
              section.status === "locked" && "text-muted-foreground/50",
            )}
          >
            <div className="flex gap-4 items-center">
              {section.status === "locked" && <CiLock size={20} />}
              {section.status === "current" && (
                <ProgressIndicator
                  progress={getSectionProgressPercentage(section)}
                />
              )}
              <div className="flex flex-col">
                <h3 className="text-base font-medium leading-normal">
                  {section.title}
                </h3>
                {section.status === "current" && (
                  <p className="text-amber-400 text-xs italic">In Progress</p>
                )}
                {section.status === "locked" && (
                  <p className="text-muted-foreground/50 text-xs italic">
                    Locked
                  </p>
                )}
                {section.status === "completed" && (
                  <p className="text-amber-400 text-xs italic">Completed</p>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col">
              <hr className="mb-3" />
              {section.concepts.map(async (concept) => {
                const lessons = await getLessonsByConceptId(concept._id);
                return (
                  <div key={concept._id}>
                    <div
                      className={cn(
                        "flex gap-3 items-center px-4 py-4 rounded-xl transition-colors",
                        concept.status === "locked" &&
                          "text-muted-foreground pointer-events-none",
                      )}
                      key={concept.description}
                    >
                      <ConceptStatusIndicator status={concept.status} />
                      <div key={concept.title} className="flex flex-col gap-1">
                        <span className="font-bold">{concept.title}</span>
                        <span className="font-normal text-xs text-muted-foreground">
                          {concept.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 text-xs mb-10 ml-10">
                      {lessons.map((lesson) => {
                        if (lesson.status === "locked") {
                          return (
                            <button
                              type="button"
                              key={lesson._id}
                              className="text-muted-foreground flex items-center gap-2"
                            >
                              <Lock size={12} />
                              {lesson.title}
                            </button>
                          );
                        }
                        return (
                          <Link
                            key={lesson._id.toString()}
                            href={`/lessons?roadmapId=${roadmapId}&sectionId=${section._id}&conceptId=${concept._id}&lessonId=${lesson._id}`}
                            className={cn(
                              "hover:underline flex items-center gap-2",
                              lesson.status === "completed" && "text-blue-500",
                              lesson.status === "current" && "text-primary",
                            )}
                          >
                            {lesson.status === "completed" && (
                              <CheckCircle size={12} />
                            )}
                            {lesson.status === "current" && (
                              <PlayCircle size={12} />
                            )}
                            {lesson.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

type ProgressIndicatorProps = {
  progress: number;
};

function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative size-10">
        <svg
          className="size-full"
          height="36"
          viewBox="0 0 36 36"
          width="36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title aria-hidden>progress</title>
          <circle
            cx="18"
            cy="18"
            fill="transparent"
            r="16"
            stroke="#325567"
            strokeWidth="2"
          ></circle>
          <circle
            className="stroke-amber-400 -rotate-90 origin-center transition-all duration-500"
            cx="18"
            cy="18"
            fill="transparent"
            r="16"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
            strokeWidth="2"
          ></circle>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center  text-xs font-bold">
          {progress}%
        </span>
      </div>
    </div>
  );
}

type ConceptStatusIndicatorProps = {
  status: "locked" | "current" | "completed";
};

function ConceptStatusIndicator({ status }: ConceptStatusIndicatorProps) {
  if (status === "locked") return <CiLock size={16} />;
  if (status === "current")
    return <PlayCircle className="text-amber-400" size={16} />;

  return <CheckCircle size={16} />;
}
