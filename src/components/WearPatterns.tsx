"use client";

import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Ghost, Lock, Sparkles } from "lucide-react";
import { clothingItems } from "@/data/wardrobe";
import { getMostWornItems, getLeastWornItems } from "@/data/calendar";

export default function WearPatterns() {
  const topItems = getMostWornItems(5);
  const bottomItems = getLeastWornItems(5);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blush-500" />
          <h2 className="text-sm font-semibold text-warm-900">
            Your Wearing Patterns
          </h2>
        </div>
        <p className="mt-0.5 text-xs text-warm-400">
          See which pieces get the most love — and which need a second chance
        </p>
      </div>

      {/* Most Worn Items */}
      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-warm-200/60">
        <h3 className="text-xs font-semibold text-warm-700">
          Top 5 Most Worn
        </h3>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {topItems.map(({ itemId, count }) => {
            const item = clothingItems.find((i) => i.id === itemId);
            if (!item) return null;
            return (
              <Link
                key={item.id}
                href={`/wardrobe/${item.id}`}
                className="w-24 shrink-0"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-warm-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-blush-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    {count}×
                  </span>
                </div>
                <p className="mt-1.5 truncate text-xs font-medium text-warm-800">
                  {item.name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Least Worn Items */}
      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-warm-200/60">
        <div className="flex items-center gap-2">
          <Ghost className="h-3.5 w-3.5 text-warm-400" />
          <h3 className="text-xs font-semibold text-warm-700">
            Collecting Dust
          </h3>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-warm-400">
          These pieces are barely worn — ask the Stylist to work them into an
          outfit
        </p>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {bottomItems.map(({ itemId, count }) => {
            const item = clothingItems.find((i) => i.id === itemId);
            if (!item) return null;
            return (
              <Link
                key={item.id}
                href={`/wardrobe/${item.id}`}
                className="w-24 shrink-0"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-warm-100 opacity-75">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-warm-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    {count}×
                  </span>
                </div>
                <p className="mt-1.5 truncate text-xs font-medium text-warm-800">
                  {item.name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Cost-Per-Wear Teaser */}
      <div className="rounded-2xl border border-dashed border-warm-300/80 bg-warm-50/50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blush-50">
            <Lock className="h-4.5 w-4.5 text-blush-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-warm-800">
                Cost-Per-Wear Leaders
              </h3>
              <span className="rounded-full bg-blush-100 px-2 py-0.5 text-[10px] font-semibold text-blush-600">
                Coming Soon
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-warm-500">
              Add prices to your wardrobe items to unlock cost-per-wear tracking
              — see which pieces give you the most value per dollar.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-warm-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                Example: White Sneakers $89 ÷ 14 wears = $6.36 per wear
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
