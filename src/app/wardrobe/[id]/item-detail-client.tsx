"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, X } from "lucide-react";
import { clothingItems } from "@/data/wardrobe";
import { getOutfitsForItem } from "@/data/outfits";

export default function ItemDetailClient({ id }: { id: string }) {
  const item = clothingItems.find((i) => i.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!item) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-lg font-semibold text-warm-800">Item not found</p>
        <Link
          href="/wardrobe"
          className="mt-4 text-sm font-medium text-blush-500 hover:text-blush-600"
        >
          Back to wardrobe
        </Link>
      </div>
    );
  }

  const relatedOutfits = getOutfitsForItem(item.id);
  const outfitItems = (outfitItemIds: string[]) =>
    outfitItemIds
      .map((oid) => clothingItems.find((ci) => ci.id === oid))
      .filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-3xl pb-24 lg:pb-8">
      {/* Hero image */}
      <div className="relative aspect-[4/5] w-full bg-warm-100 sm:aspect-[3/2]">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
        <Link
          href="/wardrobe"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface/80 backdrop-blur-sm transition-colors hover:bg-surface"
        >
          <ArrowLeft className="h-5 w-5 text-warm-800" />
        </Link>
      </div>

      <div className="space-y-6 px-4 pt-5 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-warm-900">
          {item.name}
        </h1>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-600">
            {item.category}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600">
            <span
              className="h-2.5 w-2.5 rounded-full ring-1 ring-warm-300"
              style={{ backgroundColor: item.colorHex }}
            />
            {item.color}
          </span>
          <span className="rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600">
            {item.season}
          </span>
          <span className="rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600">
            {item.formality}
          </span>
          <span className="rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600">
            {item.fabricWeight}
          </span>
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-500"
            >
              {tag}
            </span>
          ))}
        </div>

        {relatedOutfits.length > 0 && (
          <section>
            <h2 className="mb-3 text-base font-semibold text-warm-900">
              Outfits with this item
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {relatedOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="w-56 shrink-0 overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60"
                >
                  <div className="grid grid-cols-3 gap-px bg-warm-100">
                    {outfitItems(outfit.itemIds)
                      .slice(0, 3)
                      .map((oi) =>
                        oi ? (
                          <div
                            key={oi.id}
                            className="relative aspect-square bg-warm-50"
                          >
                            <Image
                              src={oi.imageUrl}
                              alt={oi.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        ) : null
                      )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-warm-800">
                      {outfit.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-warm-400">
                      {outfit.occasion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex gap-3 pt-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-warm-200 bg-surface py-3 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-50">
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-surface py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-warm-900/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-warm-100 px-5 py-4">
              <h3 className="text-base font-semibold text-warm-900">
                Delete item?
              </h3>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="rounded-full p-1 text-warm-400 hover:bg-warm-100 hover:text-warm-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-warm-500">
                Are you sure you want to remove{" "}
                <span className="font-medium text-warm-700">{item.name}</span>{" "}
                from your wardrobe? This action can&apos;t be undone.
              </p>
            </div>
            <div className="flex gap-3 border-t border-warm-100 px-5 py-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 rounded-xl border border-warm-200 bg-surface py-2.5 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
