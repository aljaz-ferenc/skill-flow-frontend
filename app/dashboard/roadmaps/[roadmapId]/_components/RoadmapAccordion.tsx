import { Check, Lock, Play } from "lucide-react";
import Link from "next/link";
import { CiLock } from "react-icons/ci";
import ConceptStatusIndicator from "@/app/dashboard/roadmaps/[roadmapId]/_components/ConceptStatusIndicator";
import ProgressIndicator from "@/app/dashboard/roadmaps/[roadmapId]/_components/ProgressIndicator";
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
      className="space-y-2 "
    >
      {sections.map((section, index) => (
        <AccordionItem value={section.title} key={section.title}>
          <AccordionTrigger
            className={cn(
              "cursor-pointer flex items-center bg-white px-4 border-none",
              section.status === "locked" && "text-muted-foreground/50",
            )}
          >
            <div className="flex gap-4 items-center">
              <span className="">Section {index + 1}:</span>
              {section.status === "locked" && <CiLock size={20} />}

              <div className="flex items-center gap-2">
                <h3 className="font-bold leading-normal">{section.title}</h3>
              </div>
              {["current", "completed"].includes(section.status) && (
                <ProgressIndicator
                  progress={getSectionProgressPercentage(section)}
                />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border-none rounded-md mt-2">
            <ul className="flex flex-col ">
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
                      <div key={concept.title} className="flex flex-col">
                        <span className="font-bold">{concept.title}</span>
                        <span className="font-normal  text-muted-foreground text-xs">
                          {concept.description}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex relative flex-col gap-3  pl-3 ml-6 before:content-[''] before:h-full before:w-px before:bg-border before:absolute before:left-0 before:top-0",
                        concept.status === "locked" ? "mb-0" : "mb-6",
                      )}
                    >
                      {lessons.map((lesson) => {
                        if (lesson.status === "locked") {
                          return (
                            <button
                              type="button"
                              key={lesson._id}
                              className="text-muted-foreground/50 flex items-center gap-2"
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
                              lesson.status === "current" && "text-amber-400",
                            )}
                          >
                            {lesson.status === "completed" && (
                              <Check size={12} />
                            )}
                            {lesson.status === "current" && <Play size={12} />}
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
