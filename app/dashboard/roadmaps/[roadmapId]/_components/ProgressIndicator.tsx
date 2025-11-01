type ProgressIndicatorProps = {
  progress: number;
};

export default function ProgressIndicator({
  progress,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative size-10">
        <svg
          className="size-full"
          height="36"
          viewBox="0 0 36 36"
          width="36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title aria-hidden>progress</title>
          <circle
            cx="18"
            cy="18"
            fill="transparent"
            r="16"
            stroke="#325567"
            strokeWidth="2"
          ></circle>
          <circle
            className="stroke-amber-400 -rotate-90 origin-center transition-all duration-500"
            cx="18"
            cy="18"
            fill="transparent"
            r="16"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
            strokeWidth="2"
          ></circle>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center  text-xs font-bold">
          {progress}%
        </span>
      </div>
    </div>
  );
}
