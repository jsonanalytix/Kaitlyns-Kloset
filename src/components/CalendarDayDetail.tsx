import Image from "next/image";
import Link from "next/link";
import { X, Pencil } from "lucide-react";
import type { CalendarEntry } from "@/lib/queries/calendar";
import type { ClothingItem } from "@/lib/queries/wardrobe";
import WeatherContextBar from "./WeatherContextBar";

interface CalendarDayDetailProps {
  entry: CalendarEntry;
  items: ClothingItem[];
  wearCounts: Record<string, number>;
  onClose: () => void;
}

function formatHeading(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function CalendarDayDetail({
  entry,
  items,
  wearCounts,
  onClose,
}: CalendarDayDetailProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h3 className="text-sm font-semibold text-warm-900">
          {formatHeading(entry.date)}
        </h3>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-warm-400 transition-colors hover:bg-warm-50 hover:text-warm-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <WeatherContextBar
          temp={entry.weatherTemp}
          condition={entry.weatherCondition}
          description={entry.weatherDescription}
        />
      </div>

      <div className="flex gap-2.5 overflow-x-auto px-4 pb-3 scrollbar-hide">
        {items.map((item) => {
          const wears = wearCounts[item.id] ?? 0;
          return (
            <Link
              key={item.id}
              href={`/wardrobe/${item.id}`}
              className="shrink-0"
            >
              <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-warm-50 transition-opacity hover:opacity-90">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                {wears >= 5 && (
                  <span className="absolute bottom-0.5 right-0.5 rounded-full bg-warm-900/70 px-1 py-px text-[9px] font-medium text-white">
                    {wears}x
                  </span>
                )}
              </div>
              <p className="mt-1 w-16 truncate text-[10px] font-medium text-warm-600">
                {item.name}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-warm-100 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-warm-900">
              {entry.outfitName}
            </h4>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {entry.occasion && (
                <span className="rounded-full bg-blush-50 px-2.5 py-0.5 text-[11px] font-medium text-blush-500">
                  {entry.occasion}
                </span>
              )}
              {entry.mood && (
                <span className="text-[11px] italic text-warm-400">
                  &ldquo;{entry.mood}&rdquo;
                </span>
              )}
            </div>
          </div>
          <Link
            href={`/calendar/log?date=${entry.date}`}
            className="flex shrink-0 items-center gap-1 rounded-full bg-warm-50 px-3 py-1.5 text-xs font-medium text-warm-600 transition-colors hover:bg-warm-100"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
