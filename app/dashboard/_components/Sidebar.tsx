"use client";

import { Map as MapIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/dashboard/roadmaps", label: "Roadmaps", icon: <MapIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full max-w-60 p-3 border-r border-black/10 border">
      <ul>
        {sidebarItems.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className={cn(
              "flex gap-2 items-center p-3 text-muted-foreground rounded-md",
              pathname.startsWith(item.href) &&
                "bg-muted text-secondary-foreground",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </ul>
    </aside>
  );
}
