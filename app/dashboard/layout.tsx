import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen">
      <aside className="max-w-60 w-full p-2 h-full bg-slate-900">SIDEBAR</aside>
      <section className="p-2">{children}</section>
    </main>
  );
}
