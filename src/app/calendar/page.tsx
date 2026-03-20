"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import {
  getEntriesForMonth,
  getEntryForDate,
  currentMonthStats,
} from "@/data/calendar";
import type { CalendarEntry } from "@/data/calendar";
import { clothingItems } from "@/data/wardrobe";
import type { ClothingItem } from "@/data/wardrobe";
import CalendarStatsBar from "@/components/CalendarStatsBar";
import CalendarGrid from "@/components/CalendarGrid";
import CalendarDayDetail from "@/components/CalendarDayDetail";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function resolveItems(ids: string[]): ClothingItem[] {
  return ids
    .map((id) => clothingItems.find((item) => item.id === id))
    .filter((item): item is ClothingItem => item != null);
}

function computeStats(entries: CalendarEntry[]) {
  if (entries.length === 0) {
    return { uniqueItemsWorn: 0, mostWornItem: null as { itemId: string; wearCount: number } | null };
  }

  const uniqueItems = new Set(entries.flatMap((e) => e.itemIds));
  const counts: Record<string, number> = {};
  for (const e of entries) {
    for (const id of e.itemIds) {
      counts[id] = (counts[id] || 0) + 1;
    }
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return {
    uniqueItemsWorn: uniqueItems.size,
    mostWornItem: sorted.length > 0
      ? { itemId: sorted[0][0], wearCount: sorted[0][1] }
      : null,
  };
}

function formatDayLabel(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function CalendarPage() {
  const today = todayISO();
  const todayParts = today.split("-");
  const currentYear = parseInt(todayParts[0]);
  const currentMonth = parseInt(todayParts[1]);

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const entries = useMemo(
    () => getEntriesForMonth(year, month),
    [year, month],
  );

  const isCurrentMonth = year === currentYear && month === currentMonth;
  const daysInMonth = new Date(year, month, 0).getDate();

  const { uniqueItemsWorn, mostWornItem } = useMemo(
    () => computeStats(entries),
    [entries],
  );

  const streak = isCurrentMonth ? currentMonthStats.currentStreak : 0;

  const selectedEntry = selectedDate ? getEntryForDate(selectedDate) : null;
  const selectedItems = selectedEntry ? resolveItems(selectedEntry.itemIds) : [];

  function handlePrevMonth() {
    setSelectedDate(null);
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    setSelectedDate(null);
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function handleToday() {
    setYear(currentYear);
    setMonth(currentMonth);
    setSelectedDate(null);
  }

  function handleSelectDate(date: string) {
    setSelectedDate((prev) => (prev === date ? null : date));
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-500 transition-colors hover:text-warm-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-warm-900">
          Outfit Calendar
        </h1>
        <p className="mt-1 text-sm text-warm-500">
          Your style diary — every outfit, every day
        </p>
      </div>

      <CalendarStatsBar
        daysLogged={entries.length}
        totalDays={daysInMonth}
        uniqueItemsWorn={uniqueItemsWorn}
        mostWornItem={mostWornItem}
        currentStreak={streak}
      />

      <CalendarGrid
        year={year}
        month={month}
        entries={entries}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {selectedDate && selectedEntry && (
        <CalendarDayDetail
          entry={selectedEntry}
          items={selectedItems}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {selectedDate && !selectedEntry && (
        <div className="rounded-2xl bg-surface p-6 text-center shadow-sm ring-1 ring-warm-200/60">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warm-50">
            <Plus className="h-5 w-5 text-warm-400" />
          </div>
          <p className="mt-3 text-sm font-medium text-warm-700">
            No outfit logged
          </p>
          <p className="mt-1 text-xs text-warm-400">
            {formatDayLabel(selectedDate)}
          </p>
          <Link
            href={`/calendar/log?date=${selectedDate}`}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blush-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-blush-600 active:scale-[0.97]"
          >
            <Plus className="h-3.5 w-3.5" />
            Log outfit
          </Link>
        </div>
      )}

      {!selectedDate && entries.length === 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-blush-50 to-warm-50 p-8 text-center ring-1 ring-warm-200/40">
          <p className="text-sm font-medium text-warm-700">
            No outfits logged this month
          </p>
          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-warm-400">
            Start logging your outfits to build your style diary. Every day you
            log helps the app learn your taste.
          </p>
        </div>
      )}
    </div>
  );
}
