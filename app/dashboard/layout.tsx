import type { ReactNode } from "react";
import Sidebar from "@/app/dashboard/_components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen">
      <Sidebar />
      <section className="p-2">{children}</section>
    </main>
  );
}
