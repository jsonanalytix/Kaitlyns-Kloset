"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, Plus, ChevronDown, Inbox } from "lucide-react";
import { getWardrobeItems, categories, type ClothingItem } from "@/lib/queries/wardrobe";

type SortOption = "recent" | "category" | "color" | "season";

const sortLabels: Record<SortOption, string> = {
  recent: "Recently added",
  category: "Category",
  color: "Color",
  season: "Season",
};

export default function WardrobePage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    getWardrobeItems().then(setItems).finally(() => setItemsLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    let result = items;

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
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "recent":
        return [...result].sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
      case "category":
        return [...result].sort((a, b) => a.category.localeCompare(b.category));
      case "color":
        return [...result].sort((a, b) => a.color.localeCompare(b.color));
      case "season":
        return [...result].sort((a, b) => a.season.localeCompare(b.season));
    }
  }, [items, activeCategory, searchQuery, sortBy]);

  if (itemsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blush-200 border-t-blush-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
      <h1 className="text-2xl font-bold tracking-tight text-warm-900">
        My Wardrobe
      </h1>
      <p className="mt-1 text-sm text-warm-500">
        {items.length} items in your closet
      </p>

      {/* Search bar */}
      <div className="mt-5 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
          <input
            type="text"
            placeholder="Search by name, color, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-warm-200 bg-surface py-2.5 pl-9 pr-4 text-base sm:text-sm text-warm-800 placeholder:text-warm-400 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-1.5 rounded-xl border border-warm-200 bg-surface px-3 py-2.5 text-sm text-warm-600 transition-colors hover:border-warm-300 hover:bg-warm-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {showSortMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSortMenu(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-warm-200 bg-surface shadow-lg">
                {(Object.entries(sortLabels) as [SortOption, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSortBy(key);
                        setShowSortMenu(false);
                      }}
                      className={`flex w-full items-center px-3.5 py-2.5 text-left text-sm transition-colors ${
                        sortBy === key
                          ? "bg-blush-50 font-medium text-blush-600"
                          : "text-warm-600 hover:bg-warm-50"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Category filter pills */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-blush-500 text-white shadow-sm"
                : "bg-warm-100 text-warm-600 hover:bg-warm-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mt-4 text-xs text-warm-400">
        Showing {filteredItems.length} item{filteredItems.length !== 1 && "s"}
        {activeCategory !== "All" && ` in ${activeCategory}`}
      </p>

      {/* Item grid or empty state */}
      {filteredItems.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warm-100">
            <Inbox className="h-7 w-7 text-warm-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-warm-700">
            No items found
          </p>
          <p className="mt-1 max-w-xs text-sm text-warm-400">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search.`
              : `No items in ${activeCategory} yet. Add some to your wardrobe!`}
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/wardrobe/${item.id}`}
              className="group overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60 transition-all hover:shadow-md active:scale-[0.98]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-warm-100">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-warm-800">
                  {item.name}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="rounded-full bg-blush-50 px-2 py-0.5 text-[10px] font-medium text-blush-600">
                    {item.category}
                  </span>
                  <span
                    className="h-3 w-3 shrink-0 rounded-full ring-1 ring-warm-200"
                    style={{ backgroundColor: item.colorHex }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Floating action button */}
      <Link
        href="/wardrobe/add"
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blush-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blush-600 active:scale-95 lg:bottom-8 lg:right-8"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
