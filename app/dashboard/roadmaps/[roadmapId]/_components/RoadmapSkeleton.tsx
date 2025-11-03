export default function RoadmapSkeleton({
  sectionsCount,
}: {
  sectionsCount: number;
}) {
  return (
    <div className="animate-pulse flex flex-col gap-10">
      {/* title */}
      <div className="h-10 w-2/3 rounded bg-gray-300" />

      {/* progress */}
      <div className="flex flex-col gap-2 w-full h-[53px] bg-gray-300" />

      {/* accordion */}
      <div className="space-y-2 w-full">
        {Array.from({ length: sectionsCount }).map((_, sectionIndex) => (
          <div className="" key={`skeleton-section-${sectionIndex + 1}`}>
            <div className="flex items-center bg-white px-4 py-2 rounded cursor-pointer !h-[72px]">
              <div className="flex gap-4 items-center h-4 w-2/3 rounded bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
