"use client";

import { Ellipsis, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteRoadmap } from "@/lib/actions";

type RoadmapDropdownMenu = {
  roadmapId: string;
};

export default function RoadmapDropdownMenu({
  roadmapId,
}: RoadmapDropdownMenu) {
  async function onDeleteRoadmap(roadmapId: string) {
    await deleteRoadmap(roadmapId).catch((err) =>
      console.log("Error deleting roadmap:", err),
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="flex justify-between cursor-pointer"
          onClick={() => onDeleteRoadmap(roadmapId)}
        >
          <span>Delete Roadmap</span>
          <Trash />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
