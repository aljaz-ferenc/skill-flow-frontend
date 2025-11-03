"use client";

import { useDebounce } from "@uidotdev/usehooks";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RoadmapSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.replace(`?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 py-4">
      <div className="flex-1">
        <Label
          htmlFor="search"
          className="flex flex-col min-w-40 h-12 w-full focus-within:outline-2 outline-primary/50"
        >
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-gray-500 dark:text-gray-400 flex border-none bg-white dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
              <Search size={18} />
            </div>
            <Input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg
             text-gray-900 dark:text-white bg-white dark:bg-gray-800
             h-full placeholder:text-gray-500 dark:placeholder:text-gray-400
             px-4 pl-2 text-base font-normal leading-normal
             focus:outline-none focus:ring-0 focus-visible:outline-none
             focus-visible:ring-0 focus-visible:ring-offset-0 border-0
             focus-visible:shadow-none !outline-none !ring-0 !border-none"
              placeholder="Search roadmaps..."
              value={query}
              onChange={(e) => setQuery(e.target.value.trim())}
            />
          </div>
        </Label>
      </div>
    </div>
  );
}
