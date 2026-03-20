import Image from "next/image";
import { Calendar, Layers, TrendingUp, Flame } from "lucide-react";

interface CalendarStatsBarProps {
  daysLogged: number;
  totalDays: number;
  uniqueItemsWorn: number;
  mostWornItem: {
    name: string;
    imageUrl: string;
    wearCount: number;
  } | null;
  currentStreak: number;
}

export default function CalendarStatsBar({
  daysLogged,
  totalDays,
  uniqueItemsWorn,
  mostWornItem,
  currentStreak,
}: CalendarStatsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-warm-200/60">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blush-50">
          <Calendar className="h-4.5 w-4.5 text-blush-500" />
        </div>
        <div>
          <p className="text-lg font-bold text-warm-900">{daysLogged}</p>
          <p className="text-[11px] text-warm-400">of {totalDays} days</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-warm-200/60">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blush-50">
          <Layers className="h-4.5 w-4.5 text-blush-500" />
        </div>
        <div>
          <p className="text-lg font-bold text-warm-900">{uniqueItemsWorn}</p>
          <p className="text-[11px] text-warm-400">items worn</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-warm-200/60">
        {mostWornItem ? (
          <>
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={mostWornItem.imageUrl}
                alt={mostWornItem.name}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-warm-900">
                {mostWornItem.name}
              </p>
              <p className="text-[11px] text-warm-400">
                {mostWornItem.wearCount}x this month
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-warm-100">
              <TrendingUp className="h-4.5 w-4.5 text-warm-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-warm-500">No data</p>
              <p className="text-[11px] text-warm-400">yet</p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-warm-200/60">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50">
          <Flame className="h-4.5 w-4.5 text-amber-500" />
        </div>
        <div>
          <p className="text-lg font-bold text-warm-900">{currentStreak}</p>
          <p className="text-[11px] text-warm-400">day streak</p>
        </div>
      </div>
    </div>
  );
}
