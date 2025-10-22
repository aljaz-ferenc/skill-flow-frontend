import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Roadmap, Section } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusColor(status: "completed" | "locked" | "current") {
  switch (status) {
    case "completed":
      return "blue-500";
    case "current":
      return "amber-400";
    case "locked":
      return "gray-500";
  }
}

export function getRoadmapProgressPercentage(roadmap: Roadmap) {
  const allConcepts = roadmap.sections.flatMap((s) => s.concepts);
  const completedConcepts = allConcepts.reduce((acc, c) => {
    if (c.status === "completed") return acc + 1;
    else return acc;
  }, 0);

  return Math.round((completedConcepts / allConcepts.length) * 100);
}

export function getSectionProgressPercentage(section: Section) {
  return Math.round(
    (section.concepts.filter((c) => c.status === "completed").length /
      section.concepts.length) *
      100,
  );
}
