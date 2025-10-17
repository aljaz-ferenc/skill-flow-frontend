import { Map as MapIcon } from "lucide-react";
import Link from "next/link";

const sidebarItems = [
  { href: "/dashboard/roadmaps", label: "Roadmaps", icon: <MapIcon /> },
];

export default function Sidebar() {
  return (
    <aside className="w-full max-w-60 py-3">
      <ul>
        {sidebarItems.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className="flex gap-2 items-center px-3"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </ul>
    </aside>
  );
}
