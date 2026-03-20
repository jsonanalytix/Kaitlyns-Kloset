import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak < 2) return null;

  return (
    <div className="flex items-center gap-1">
      <Flame className="h-3.5 w-3.5 text-amber-500" />
      <span className="text-xs font-medium text-warm-500">
        {streak}-day streak
      </span>
    </div>
  );
}
