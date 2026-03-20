"use client";

import { Palette, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { currentMonthStats, previousMonthStats } from "@/data/calendar";

export default function OutfitVarietyScore() {
  const { outfitCombinations, uniqueItemsWorn, wardrobeUtilization } =
    currentMonthStats;
  const prevCombinations = previousMonthStats.outfitCombinations;
  const delta = outfitCombinations - prevCombinations;

  const encouragement =
    wardrobeUtilization >= 70
      ? `You're using ${wardrobeUtilization}% of your wardrobe — great job!`
      : `Only using ${wardrobeUtilization}% of your wardrobe — let's fix that`;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blush-50/80 to-surface p-5 shadow-sm ring-1 ring-warm-200/60">
      <div className="flex items-center gap-2">
        <Palette className="h-4.5 w-4.5 text-blush-500" />
        <h2 className="text-sm font-semibold text-warm-900">
          Outfit Variety Score
        </h2>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-warm-900">
          {outfitCombinations}
        </span>
        <span className="text-sm text-warm-500">
          unique combos this month from{" "}
          <span className="font-semibold text-warm-700">
            {uniqueItemsWorn} items
          </span>
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5">
        {delta > 0 ? (
          <ArrowUp className="h-3.5 w-3.5 text-emerald-500" />
        ) : delta < 0 ? (
          <ArrowDown className="h-3.5 w-3.5 text-red-400" />
        ) : (
          <Minus className="h-3.5 w-3.5 text-warm-400" />
        )}
        <span
          className={`text-xs font-medium ${
            delta > 0
              ? "text-emerald-600"
              : delta < 0
                ? "text-red-500"
                : "text-warm-500"
          }`}
        >
          {delta > 0 ? "Up" : delta < 0 ? "Down" : "Same as"} from{" "}
          {prevCombinations} last month
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-warm-600">
        {encouragement}
      </p>
    </div>
  );
}
