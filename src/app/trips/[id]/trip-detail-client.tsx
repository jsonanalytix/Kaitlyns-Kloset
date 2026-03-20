"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Luggage,
  Sun,
  Thermometer,
  Check,
  Sparkles,
  Moon,
  Droplets,
  BatteryCharging,
} from "lucide-react";
import { getTripById, forgottenEssentials, type Trip } from "@/lib/queries/trips";
import { getWardrobeItems, type ClothingItem } from "@/lib/queries/wardrobe";

function getItemById(itemId: string, items: ClothingItem[]) {
  return items.find((item) => item.id === itemId);
}

const essentialIcons: Record<string, React.ElementType> = {
  sparkles: Sparkles,
  moon: Moon,
  droplets: Droplets,
  "battery-charging": BatteryCharging,
};

export default function TripDetailClient({ id }: { id: string }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [allItems, setAllItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"days" | "packing">("days");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([getTripById(id), getWardrobeItems()]).then(
      ([tripData, itemsData]) => {
        setTrip(tripData);
        setAllItems(itemsData);
        setLoading(false);
      }
    );
  }, [id]);

  useEffect(() => {
    if (trip) {
      const initial: Record<string, boolean> = {};
      trip.packingList.forEach((item) => {
        initial[item.itemId] = item.packed;
      });
      setPackedItems(initial);
    }
  }, [trip]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blush-200 border-t-blush-500" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-sm text-warm-500">Trip not found.</p>
        <Link
          href="/trips"
          className="mt-4 text-sm font-medium text-blush-500 hover:text-blush-600"
        >
          Back to trips
        </Link>
      </div>
    );
  }

  const packedCount = Object.values(packedItems).filter(Boolean).length;
  const totalPackingItems = trip.packingList.length;

  function togglePacked(itemId: string) {
    setPackedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  const groupedPacking = trip.packingList.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof trip.packingList>
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
      <Link
        href="/trips"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-500 transition-colors hover:text-warm-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to trips
      </Link>

      {/* Trip header */}
      <div className="mt-4 overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60">
        <div className="relative h-44 overflow-hidden bg-warm-100 sm:h-56">
          <Image
            src={trip.coverImage}
            alt={trip.destination}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              {trip.name}
            </h1>
            <p className="mt-0.5 text-sm text-white/80">{trip.destination}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-4">
          <div className="flex items-center gap-1.5 rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600">
            <Thermometer className="h-3.5 w-3.5" />
            {trip.weatherSummary}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600">
            <Luggage className="h-3.5 w-3.5" />
            {trip.luggageLabel}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-600">
            <Sun className="h-3.5 w-3.5" />
            {trip.totalOutfits} outfits from {trip.totalItems} items
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mt-6 flex rounded-xl bg-warm-100 p-1">
        <button
          onClick={() => setActiveTab("days")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "days"
              ? "bg-surface text-warm-900 shadow-sm"
              : "text-warm-500 hover:text-warm-700"
          }`}
        >
          Day by Day
        </button>
        <button
          onClick={() => setActiveTab("packing")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "packing"
              ? "bg-surface text-warm-900 shadow-sm"
              : "text-warm-500 hover:text-warm-700"
          }`}
        >
          Packing List
        </button>
      </div>

      {/* Day-by-day view */}
      {activeTab === "days" && (
        <div className="mt-4 space-y-3">
          {trip.days.map((day) => {
            const isExpanded = expandedDay === day.day;
            const dayItems = day.outfitItemIds
              .map((itemId) => getItemById(itemId, allItems))
              .filter(Boolean);

            return (
              <div
                key={day.day}
                className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60"
              >
                <button
                  onClick={() =>
                    setExpandedDay(isExpanded ? null : day.day)
                  }
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-warm-50/50 active:bg-warm-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush-50 text-sm font-bold text-blush-600">
                      {day.day}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-warm-900">
                        {day.label}
                      </p>
                      <p className="text-xs text-warm-400">
                        {day.outfitName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-warm-100 px-2.5 py-0.5 text-[10px] font-medium text-warm-500">
                      {day.activity}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-warm-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-warm-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-warm-100 px-4 pb-4 pt-3">
                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                      {dayItems.map(
                        (item) =>
                          item && (
                            <div key={item.id} className="w-20 shrink-0">
                              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-warm-100">
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                              <p className="mt-1 truncate text-[10px] font-medium text-warm-700">
                                {item.name}
                              </p>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Packing checklist */}
      {activeTab === "packing" && (
        <div className="mt-4 space-y-5">
          {/* Progress bar */}
          <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-warm-200/60">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-warm-700">Packing progress</span>
              <span className="font-semibold text-blush-600">
                {packedCount} of {totalPackingItems} items
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-warm-100">
              <div
                className="h-full rounded-full bg-blush-500 transition-all duration-300"
                style={{
                  width: `${(packedCount / totalPackingItems) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Grouped items */}
          {Object.entries(groupedPacking).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-warm-400">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((packItem) => {
                  const item = getItemById(packItem.itemId, allItems);
                  if (!item) return null;
                  const isPacked = packedItems[packItem.itemId];

                  return (
                    <button
                      key={packItem.itemId}
                      onClick={() => togglePacked(packItem.itemId)}
                      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
                        isPacked
                          ? "bg-warm-50 ring-1 ring-warm-200/40"
                          : "bg-surface shadow-sm ring-1 ring-warm-200/60"
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                          isPacked
                            ? "border-blush-500 bg-blush-500"
                            : "border-warm-300"
                        }`}
                      >
                        {isPacked && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-warm-100">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className={`object-cover transition-opacity ${
                            isPacked ? "opacity-50" : ""
                          }`}
                          sizes="40px"
                        />
                      </div>
                      <span
                        className={`text-sm transition-all ${
                          isPacked
                            ? "text-warm-400 line-through"
                            : "font-medium text-warm-800"
                        }`}
                      >
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Forgotten essentials */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-warm-900">
              Don&apos;t forget
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {forgottenEssentials.map((essential) => {
                const Icon = essentialIcons[essential.icon] || Sparkles;
                return (
                  <div
                    key={essential.label}
                    className="flex items-start gap-2.5 rounded-xl bg-blush-50/60 p-3"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blush-400" />
                    <div>
                      <p className="text-xs font-semibold text-warm-800">
                        {essential.label}
                      </p>
                      <p className="text-[10px] leading-relaxed text-warm-500">
                        {essential.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
