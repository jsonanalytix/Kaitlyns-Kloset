"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  CloudRain,
  Sun,
  Sparkles,
  Leaf,
} from "lucide-react";
import { getInsights, type InsightsData } from "@/lib/queries/user";
import { getItemsByIds, type ClothingItem } from "@/lib/queries/wardrobe";
import WearPatterns from "@/components/WearPatterns";
import OutfitVarietyScore from "@/components/OutfitVarietyScore";

const gapIcons: Record<string, React.ElementType> = {
  briefcase: Briefcase,
  "cloud-rain": CloudRain,
  sun: Sun,
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [underusedItems, setUnderusedItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInsights()
      .then(async (data) => {
        setInsights(data);
        const items = await getItemsByIds(data.underusedItemIds);
        setUnderusedItems(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !insights) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blush-200 border-t-blush-500" />
      </div>
    );
  }

  const maxCategoryCount = Math.max(
    ...(insights?.categoryBreakdown.map((c) => c.count) ?? [1])
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-500 transition-colors hover:text-warm-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </Link>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-warm-900">
        Wardrobe Insights
      </h1>
      <p className="mt-1 text-sm text-warm-500">
        Understand your wardrobe and discover what&apos;s missing
      </p>

      {/* Wardrobe Score */}
      <div className="mt-6 flex flex-col items-center rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-warm-200/60">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#F2EDE8"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#C9918F"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(insights.wardrobeScore / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold text-warm-900">
              {insights.wardrobeScore}
            </span>
            <span className="text-[10px] font-medium text-warm-400">
              out of 100
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-warm-700">
          {insights.scoreLabel}
        </p>
        <p className="mt-1 max-w-xs text-center text-xs leading-relaxed text-warm-400">
          Based on category balance, versatility, and seasonal coverage
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="mt-6 rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-warm-200/60">
        <h2 className="text-sm font-semibold text-warm-900">
          Category Breakdown
        </h2>
        <div className="mt-4 space-y-3">
          {insights.categoryBreakdown.map((cat) => (
            <div key={cat.category}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-warm-700">
                  {cat.category}
                </span>
                <span className="text-warm-400">
                  {cat.count} items
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-warm-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(cat.count / maxCategoryCount) * 100}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Style Gaps */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-warm-900">Style Gaps</h2>
        <p className="mt-0.5 text-xs text-warm-400">
          Pieces that would expand your outfit possibilities
        </p>
        <div className="mt-3 space-y-3">
          {insights.gapSuggestions.map((gap) => {
            const Icon = gapIcons[gap.icon] || Sparkles;
            return (
              <div
                key={gap.id}
                className="flex items-start gap-3 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-warm-200/60"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blush-50">
                  <Icon className="h-5 w-5 text-blush-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-warm-800">
                    {gap.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-warm-500">
                    {gap.description}
                  </p>
                </div>
                <button className="shrink-0 rounded-lg bg-blush-50 px-3 py-1.5 text-xs font-medium text-blush-600 transition-colors hover:bg-blush-100">
                  Explore
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Underused Items */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-warm-900">
          Underused Items
        </h2>
        <p className="mt-0.5 text-xs text-warm-400">
          These pieces haven&apos;t appeared in any outfits — try asking the
          stylist to incorporate them
        </p>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {underusedItems.map((item) => (
            <Link
              key={item.id}
              href={`/wardrobe/${item.id}`}
              className="w-28 shrink-0"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-warm-100">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <p className="mt-1.5 truncate text-xs font-medium text-warm-800">
                {item.name}
              </p>
              <p className="text-[10px] text-warm-400">{item.category}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Wearing Patterns */}
      <div className="mt-6">
        <WearPatterns />
      </div>

      {/* Outfit Variety Score */}
      <div className="mt-6">
        <OutfitVarietyScore />
      </div>

      {/* Seasonal Readiness */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-blush-50 to-warm-50 p-5 ring-1 ring-warm-200/40">
        <div className="flex items-center gap-2">
          <Leaf className="h-4.5 w-4.5 text-blush-500" />
          <h2 className="text-sm font-semibold text-warm-900">
            Seasonal Readiness —{" "}
            {insights.seasonalReadiness.season}
          </h2>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-warm-600">
          {insights.seasonalReadiness.message}
        </p>
      </div>
    </div>
  );
}
