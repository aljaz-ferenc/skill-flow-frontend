import { CheckCircle, Lock, PlayCircle } from "lucide-react";

type ConceptStatusIndicatorProps = {
  status: "locked" | "current" | "completed";
};

export default function ConceptStatusIndicator({
  status,
}: ConceptStatusIndicatorProps) {
  if (status === "locked") return <Lock size={16} />;
  if (status === "current")
    return <PlayCircle className="text-amber-400" size={16} />;

  return <CheckCircle size={16} className="text-primary" />;
}
