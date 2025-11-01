import type { ReactNode } from "react";

type HowItWorksCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export default function HowItWorksCard({
  icon,
  description,
  title,
}: HowItWorksCardProps) {
  return (
    <div className="relative flex flex-col items-center text-center p-4 bg-white rounded-md">
      <div className="flex items-center justify-center size-12 rounded-full bg-primary text-white border-4 border-background-light dark:border-background-dark mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}
