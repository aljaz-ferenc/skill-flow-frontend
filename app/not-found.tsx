import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-grow flex items-center justify-center py-10 px-4 h-screen">
      <div className="flex flex-col items-center gap-8 text-center max-w-lg w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-slate-900 dark:text-slate-50 text-3xl md:text-4xl font-bold leading-tight tracking-tighter">
              <span className="block">404</span>
              <span className="text-3xl">Page Not Found</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal max-w-md">
              Oops! The page you are looking for does not exist. It might have
              been moved or deleted.
            </p>
          </div>
          <Link
            href="/dashboard/roadmaps"
            className="flex min-w-[84px] w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
          >
            <span>Go to Dashboard</span>
          </Link>
        </div>
        <Link
          className="text-primary text-sm font-medium leading-normal underline"
          href="/"
        >
          or Return to Homepage
        </Link>
      </div>
    </main>
  );
}
