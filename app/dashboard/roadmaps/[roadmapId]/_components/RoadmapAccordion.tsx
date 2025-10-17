import { Lock } from "lucide-react";
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
              <Lock />
              <div className="flex flex-col">
                <span className="font-bold text-lg">{section.title}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {section.description}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col">
              <hr className="mb-3" />
              {section.lessons.map((lesson) => (
                <Link
                  href={`/dashboard/roadmaps/${roadmapId}/lessons/${lesson.title}`}
                  className="flex gap-3 items-center hover:bg-muted px-4 py-4 rounded-xl transition-colors"
                  key={lesson.description}
                >
                  <Lock size={16} />
                  <div key={lesson.title} className="flex flex-col gap-1">
                    <span className="font-bold">{lesson.title}</span>
                    <span className="font-normal text-xs">
                      {lesson.description}
                    </span>
                  </div>
                </Link>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
