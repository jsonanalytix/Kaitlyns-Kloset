"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEntry } from "@/data/calendar";
import { clothingItems } from "@/data/wardrobe";
import type { ClothingItem } from "@/data/wardrobe";

interface CalendarGridProps {
  year: number;
  month: number;
  entries: CalendarEntry[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function resolveItems(ids: string[]): ClothingItem[] {
  return ids
    .map((id) => clothingItems.find((item) => item.id === id))
    .filter((item): item is ClothingItem => item != null);
}

function DayThumbnail({ items }: { items: ClothingItem[] }) {
  if (items.length === 0) return null;

  if (items.length === 1) {
    return (
      <div className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-warm-200/60">
        <Image
          src={items[0].imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="24px"
        />
      </div>
    );
  }

  const display = items.slice(0, 4);

  return (
    <div className="h-6 w-6 overflow-hidden rounded-full ring-1 ring-warm-200/60">
      <div
        className="grid h-full w-full grid-cols-2"
        style={{ gridTemplateRows: display.length > 2 ? "1fr 1fr" : "1fr" }}
      >
        {display.map((item) => (
          <div key={item.id} className="relative overflow-hidden">
            <Image
              src={item.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="12px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarGrid({
  year,
  month,
  entries,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarGridProps) {
  const today = todayISO();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const entryByDate = new Map<string, CalendarEntry>();
  for (const entry of entries) {
    entryByDate.set(entry.date, entry);
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const todayParts = today.split("-");
  const isCurrentMonth =
    parseInt(todayParts[0]) === year && parseInt(todayParts[1]) === month;

  return (
    <div className="rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60">
      <div className="flex items-center justify-between border-b border-warm-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-warm-50 active:bg-warm-100"
          >
            <ChevronLeft className="h-4 w-4 text-warm-600" />
          </button>
          <h3 className="min-w-[150px] text-center text-sm font-semibold text-warm-900">
            {MONTH_NAMES[month - 1]} {year}
          </h3>
          <button
            onClick={onNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-warm-50 active:bg-warm-100"
          >
            <ChevronRight className="h-4 w-4 text-warm-600" />
          </button>
        </div>
        {!isCurrentMonth && (
          <button
            onClick={onToday}
            className="rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-500 transition-colors hover:bg-blush-100"
          >
            Today
          </button>
        )}
      </div>

      <div className="grid grid-cols-7 px-2 pt-2">
        {DAY_LABELS.map((label, i) => (
          <div
            key={i}
            className="py-2 text-center text-[11px] font-medium text-warm-400"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px px-2 pb-3">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`pad-${idx}`} className="min-h-[52px]" />;
          }

          const dateISO = toISO(year, month, day);
          const entry = entryByDate.get(dateISO);
          const isToday = dateISO === today;
          const isSelected = dateISO === selectedDate;
          const isFuture = dateISO > today;
          const thumbItems = entry ? resolveItems(entry.itemIds.slice(0, 4)) : [];

          return (
            <button
              key={dateISO}
              onClick={() => !isFuture && onSelectDate(dateISO)}
              disabled={isFuture}
              className={`flex min-h-[52px] flex-col items-center gap-1 rounded-xl p-1 transition-all ${
                isSelected
                  ? "bg-blush-50 ring-2 ring-blush-400"
                  : isToday
                    ? "ring-2 ring-blush-300"
                    : "hover:bg-warm-50"
              } ${isFuture ? "cursor-default opacity-35" : "cursor-pointer"}`}
            >
              <span
                className={`text-[11px] leading-none ${
                  isSelected
                    ? "font-semibold text-blush-600"
                    : isToday
                      ? "font-semibold text-blush-500"
                      : "font-medium text-warm-700"
                }`}
              >
                {day}
              </span>
              <div className="flex h-7 items-center justify-center">
                {entry && thumbItems.length > 0 ? (
                  <DayThumbnail items={thumbItems} />
                ) : !isFuture ? (
                  <div className="h-5 w-5 rounded-full border border-dashed border-warm-200" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
