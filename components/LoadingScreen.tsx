import { PuffLoader } from "react-spinners";

type LoadingScreenProps = {
  text?: string;
};

export default function LoadingScreen({ text }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <PuffLoader color="var(--color-primary)" />
      <p className="mt-4 text-sm text-muted-foreground font-bold animate-pulse">
        {text ? text : "Loading..."}
      </p>
    </div>
  );
}
