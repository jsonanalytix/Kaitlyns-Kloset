"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Check, X } from "lucide-react";
import { categories, type ClothingItem } from "@/lib/queries/wardrobe";

interface ItemSelectorGridProps {
  allItems: ClothingItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function ItemSelectorGrid({
  allItems,
  selectedIds,
  onToggle,
  onRemove,
}: ItemSelectorGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    let result = allItems;
    if (activeCategory !== "All") {
      result = result.filter((item) => item.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.color.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [allItems, activeCategory, searchQuery]);

  const selectedItems = selectedIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter((item): item is ClothingItem => item != null);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
        <input
          type="text"
          placeholder="Search by name, color, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-warm-200 bg-surface py-2.5 pl-9 pr-4 text-base text-warm-800 placeholder:text-warm-400 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100 sm:text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-blush-500 text-white shadow-sm"
                : "bg-warm-100 text-warm-600 hover:bg-warm-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-warm-400">
        {filteredItems.length} item{filteredItems.length !== 1 && "s"}
        {activeCategory !== "All" && ` in ${activeCategory}`}
      </p>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {filteredItems.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`group relative overflow-hidden rounded-xl text-left transition-all active:scale-[0.97] ${
                isSelected
                  ? "ring-2 ring-blush-500 shadow-md"
                  : "ring-1 ring-warm-200/60 hover:ring-warm-300"
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-warm-100">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 33vw, 25vw"
                />
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blush-500/20">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blush-500 shadow-md">
                      <Check className="h-4 w-4 text-white" />
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-surface p-2">
                <p className="truncate text-xs font-medium text-warm-800">
                  {item.name}
                </p>
                <span className="mt-0.5 inline-block rounded-full bg-blush-50 px-1.5 py-0.5 text-[10px] font-medium text-blush-600">
                  {item.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedIds.length > 0 && (
        <div className="rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-warm-200/60">
          <p className="mb-2 text-xs font-medium text-warm-500">
            {selectedIds.length} item{selectedIds.length !== 1 && "s"} selected
          </p>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide">
            {selectedItems.map((item) => (
              <div key={item.id} className="relative shrink-0">
                <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-blush-200">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-warm-600 text-white shadow-sm transition-colors hover:bg-warm-700"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
