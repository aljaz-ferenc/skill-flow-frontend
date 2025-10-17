import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Roadmap } from "@/lib/types";

type RoadmapAccordionProps = {
  sections: Roadmap["sections"];
  roadmapId: Roadmap["_id"];
};

export default function RoadmapAccordion({
  sections,
  roadmapId,
}: RoadmapAccordionProps) {
  return (
    <Accordion type="multiple">
      {sections.map((section) => (
        <AccordionItem value={section.title} key={section.title}>
          <AccordionTrigger className="cursor-pointer">
            <div className="flex gap-4 items-center">
              {/*<Lock />*/}
              <ProgressIndicator progress={90} />
              <div className="flex flex-col">
                <h3 className="text-base font-medium leading-normal">
                  {section.title}
                </h3>
                <p className="text-amber-400 text-sm">In Progress</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col">
              <hr className="mb-3" />
              {section.concepts.map((concept, index) => {
                const status = index === 0 ? "current" : "locked";
                return (
                  <Link
                    href={
                      status === "locked"
                        ? `/dashboard/roadmaps/${roadmapId}`
                        : `/dashboard/roadmaps/${roadmapId}/concepts/${concept.title}`
                    }
                    className="flex gap-3 items-center hover:bg-muted px-4 py-4 rounded-xl transition-colors"
                    key={concept.description}
                  >
                    <ConceptStatusIndicator status={status} />
                    <div key={concept.title} className="flex flex-col gap-1">
                      <span className="font-bold">{concept.title}</span>
                      <span className="font-normal text-xs">
                        {concept.description}
                      </span>
                    </div>
                  </Link>
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
  if (status === "locked") return <Lock size={16} />;
  if (status === "current")
    return <PlayCircle className="text-amber-400" size={16} />;

  return <CheckCircle />;
}
