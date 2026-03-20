"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Inbox,
} from "lucide-react";
import { getSavedOutfits, type StylistOutfit } from "@/lib/queries/stylist";
import { getWardrobeItems, type ClothingItem } from "@/lib/queries/wardrobe";

export default function SavedOutfitsPage() {
  const [savedOutfits, setSavedOutfits] = useState<StylistOutfit[]>([]);
  const [allItems, setAllItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSavedOutfits(), getWardrobeItems()])
      .then(([outfits, items]) => {
        setSavedOutfits(outfits);
        setAllItems(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
        <div className="flex items-center gap-3">
          <Link
            href="/stylist"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-warm-500 transition-colors hover:bg-warm-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight text-warm-900">
              Saved Outfits
            </h1>
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-warm-100" />
          </div>
        </div>
        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-warm-100" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Link
          href="/stylist"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-warm-500 transition-colors hover:bg-warm-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-warm-900">
            Saved Outfits
          </h1>
          <p className="text-sm text-warm-500">
            {savedOutfits.length} outfit{savedOutfits.length !== 1 && "s"} saved
          </p>
        </div>
      </div>

      {savedOutfits.length === 0 ? (
        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warm-100">
            <Inbox className="h-7 w-7 text-warm-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-warm-700">
            No saved outfits yet
          </p>
          <p className="mt-1 max-w-xs text-sm text-warm-400">
            Start a conversation with the AI Stylist to build some!
          </p>
          <Link
            href="/stylist"
            className="mt-4 rounded-xl bg-blush-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blush-600"
          >
            Chat with Stylist
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {savedOutfits.map((outfit) => (
            <SavedOutfitCard
              key={outfit.id}
              outfit={outfit}
              allItems={allItems}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SavedOutfitCard({
  outfit,
  allItems,
}: {
  outfit: StylistOutfit;
  allItems: ClothingItem[];
}) {
  const [expanded, setExpanded] = useState(false);
  const items = outfit.itemIds
    .map((id) => allItems.find((i) => i.id === id))
    .filter((i): i is ClothingItem => i != null);

  const formattedDate = new Date(outfit.savedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60 transition-shadow hover:shadow-md">
      {/* Item image grid */}
      <div className="grid grid-cols-4 gap-px bg-warm-100">
        {items.slice(0, 4).map((item) => (
          <div key={item.id} className="relative aspect-square bg-warm-50">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 25vw, 120px"
            />
          </div>
        ))}
        {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square bg-warm-50" />
        ))}
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-warm-900">{outfit.name}</h3>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="rounded-full bg-blush-50 px-2 py-0.5 text-[10px] font-medium text-blush-500">
                {outfit.occasion}
              </span>
              <span className="text-[11px] text-warm-400">{formattedDate}</span>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-1.5 text-warm-400 transition-colors hover:bg-warm-50 hover:text-warm-600"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 space-y-3 border-t border-warm-100 pt-3">
            {/* AI explanation */}
            <div className="flex gap-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blush-400" />
              <p className="text-xs leading-relaxed text-warm-500">
                {outfit.explanation}
              </p>
            </div>

            {/* Full item list */}
            <div className="space-y-2">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/wardrobe/${item.id}`}
                  className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-warm-50"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-warm-50">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-warm-800">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-warm-400">{item.category}</p>
                  </div>
                  <span
                    className="h-3 w-3 shrink-0 rounded-full ring-1 ring-warm-200"
                    style={{ backgroundColor: item.colorHex }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
