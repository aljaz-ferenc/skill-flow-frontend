"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ErrorPage() {
  return (
    <main className="h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <h2 className="text-slate-900 dark:text-slate-50 text-3xl md:text-4xl font-bold leading-tight tracking-tighter">
          <span className="block">404</span>
          <span className="text-3xl">Roadmap not found</span>
        </h2>
        <div className="max-w-90 text-muted-foreground">
          Oops! The roadmap you're looking for doesn't exist or it has been
          removed.
        </div>
        <Link
          className={cn(
            "flex min-w-[84px] w-full mx-auto max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors",
          )}
          href="/dashboard/roadmaps"
        >
          Back to Roadmaps
        </Link>
      </div>
    </main>
  );
}
