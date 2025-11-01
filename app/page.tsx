import { Flag, Shapes } from "lucide-react";
import Link from "next/link";
import { FaTimeline } from "react-icons/fa6";
import HowItWorksCard from "@/app/_components/HowItWorksCard";

const cards = [
  {
    title: "Set Your Goal",
    description: "Tell us what you want to learn.",
    icon: <Flag />,
  },
  {
    title: "Follow a Personalized Roadmap",
    description:
      "AI creates a step-by-step plan tailored to your goal and experience.",
    icon: <FaTimeline />,
  },
  {
    title: "Practice & Prove It",
    description:
      "Short quizzes and checks reinforce learning and track progress.",
    icon: <Shapes />,
  },
];

export default function Home() {
  return (
    <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8">
      <div className="@container">
        <div className="flex flex-col gap-8 px-4 py-16 text-center md:py-24">
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl text-gray-900 dark:text-white max-w-3xl">
              Learn Anything — The Smart Way
            </h1>
            <h2 className="text-base font-normal leading-normal md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              AI-designed learning paths, focused lessons, and quizzes that turn
              knowledge into mastery.
            </h2>
          </div>
          <Link
            href="/dashboard/roadmaps"
            className="flex self-center min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all transform hover:scale-105"
          >
            Create Your Roadmap
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-10 px-4 pt-16 @container md:pt-24 mb-8">
        <div className="flex flex-col gap-3 text-center items-center">
          <h2 className="text-3xl font-bold leading-tight tracking-[-0.033em] md:text-4xl text-gray-900 dark:text-white max-w-2xl">
            Unlock Your Potential
          </h2>
          <p className="text-base font-normal leading-normal text-gray-600 dark:text-gray-300 max-w-2xl">
            Our AI-powered platform provides you with everything you need to
            succeed in your learning journey.
          </p>
        </div>
      </div>
      <div className="px-4 pt-8">
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <HowItWorksCard
              key={card.title}
              title={card.title}
              description={card.description}
              icon={card.icon}
            />
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-primary/90 dark:bg-primary/30 px-4 py-16 my-16 md:my-24">
        <div className="flex flex-col gap-6 items-center text-center  px-5">
          <h2 className="text-3xl font-bold text-white max-w-lg">
            Ready to Start Your Journey?
          </h2>
          <p className="text-base text-white/80 max-w-md">
            Join learners building real skills with bite-sized lessons and smart
            review.
          </p>
          <Link
            href="/dashboard/roadmaps"
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white text-primary text-base font-bold shadow-lg hover:bg-gray-100 transition-colors"
          >
            Start for Free
          </Link>
        </div>
      </div>
    </main>
  );
}
