import Sidebar from "@/app/dashboard/_components/Sidebar";

export default async function DashboardLayout(
  props: LayoutProps<"/dashboard">,
) {
  return (
    <main className="flex min-h-screen  max-w-screen overflow-x-hidden">
      <Sidebar />
      <section className="p-2 w-full">{props.children}</section>
    </main>
  );
}
