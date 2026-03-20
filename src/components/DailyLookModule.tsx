"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, RefreshCw, X, ChevronRight } from "lucide-react";
import {
  getDailySuggestions,
  getMonthlyStats,
  getEntryForDate,
  type DailySuggestion,
  type MonthlyStats,
} from "@/lib/queries/calendar";
import { getWardrobeItems, type ClothingItem } from "@/lib/queries/wardrobe";
import {
  getCurrentWeather,
  getUserPosition,
  type CurrentWeather,
} from "@/lib/api/weather";
import WeatherContextBar from "./WeatherContextBar";
import StreakBadge from "./StreakBadge";

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

function imageGridCols(count: number) {
  if (count <= 3) return "grid-cols-3";
  if (count === 5) return "grid-cols-5";
  return "grid-cols-4";
}

export default function DailyLookModule() {
  const [dailySuggestions, setDailySuggestions] = useState<DailySuggestion[]>(
    [],
  );
  const [monthStats, setMonthStats] = useState<MonthlyStats | null>(null);
  const [allItems, setAllItems] = useState<ClothingItem[]>([]);
  const [todayEntry, setTodayEntry] = useState<
    Awaited<ReturnType<typeof getEntryForDate>>
  >(null);
  const [liveWeather, setLiveWeather] = useState<CurrentWeather | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isLogged, setIsLogged] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loggedSuggestionIdx, setLoggedSuggestionIdx] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const today = getTodayISO();
    const now = new Date();
    Promise.all([
      getEntryForDate(today),
      getDailySuggestions(),
      getMonthlyStats(now.getFullYear(), now.getMonth() + 1),
      getWardrobeItems(),
    ])
      .then(([entry, suggestions, stats, items]) => {
        setTodayEntry(entry);
        setDailySuggestions(suggestions.length > 0 ? suggestions : []);
        setMonthStats(stats);
        setAllItems(items);
        setDataLoading(false);
      })
      .catch(() => setDataLoading(false));

    getUserPosition()
      .then((pos) => {
        if (pos) return getCurrentWeather(pos.coords.latitude, pos.coords.longitude);
        return null;
      })
      .then((weather) => {
        if (weather) setLiveWeather(weather);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (todayEntry) setIsLogged(true);
  }, [todayEntry]);

  function resolveItems(itemIds: string[]): ClothingItem[] {
    return itemIds
      .map((id) => allItems.find((item) => item.id === id))
      .filter((item): item is ClothingItem => item != null);
  }

  const streak = monthStats?.currentStreak ?? 0;

  if (dataLoading || dailySuggestions.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-base font-semibold text-warm-900">
          Your daily look
        </h2>
        <div className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-warm-200/60">
          <div className="h-32 animate-pulse rounded-lg bg-warm-100" />
        </div>
      </section>
    );
  }

  const suggestion = dailySuggestions[suggestionIndex];
  const suggestionItems = resolveItems(suggestion.itemIds);

  function handleWearThis() {
    setLoggedSuggestionIdx(suggestionIndex);
    setIsLogged(true);
    setIsDismissed(false);
  }

  function handleShuffle() {
    setSuggestionIndex((i) => (i + 1) % dailySuggestions.length);
  }

  function handleDismiss() {
    setIsDismissed(true);
    setIsLogged(false);
  }

  function handleEdit() {
    setIsLogged(false);
    setIsDismissed(false);
    setLoggedSuggestionIdx(null);
  }

  function handleUndismiss() {
    setIsDismissed(false);
  }

  // --- Logged state ---
  if (isLogged) {
    const useSuggestion = loggedSuggestionIdx !== null;
    const loggedSource = useSuggestion
      ? dailySuggestions[loggedSuggestionIdx]
      : null;

    const displayItems = useSuggestion
      ? resolveItems(loggedSource!.itemIds)
      : todayEntry
        ? resolveItems(todayEntry.itemIds)
        : suggestionItems;

    const displayName = useSuggestion
      ? loggedSource!.outfitName
      : todayEntry?.outfitName ?? suggestion.outfitName;

    const displayNote = useSuggestion
      ? loggedSource!.stylingNote
      : todayEntry?.weatherDescription;

    const weatherTemp = liveWeather?.temp
      ?? (useSuggestion
        ? loggedSource!.weatherTemp
        : (todayEntry?.weatherTemp ?? suggestion.weatherTemp));

    const weatherCondition = liveWeather?.condition
      ?? (useSuggestion
        ? loggedSource!.weatherCondition
        : (todayEntry?.weatherCondition ?? suggestion.weatherCondition));

    const weatherDescription = liveWeather?.description
      ?? (useSuggestion
        ? loggedSource!.weatherDescription
        : (todayEntry?.weatherDescription ?? suggestion.weatherDescription));

    const cols = imageGridCols(displayItems.length);

    return (
      <section>
        <h2 className="mb-3 text-base font-semibold text-warm-900">
          Your daily look
        </h2>
        <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60">
          <div className="p-4 pb-3">
            <WeatherContextBar
              temp={weatherTemp}
              condition={weatherCondition}
              description={weatherDescription}
            />
          </div>

          <div className={`grid ${cols} gap-px bg-warm-100`}>
            {displayItems.map((item) => (
              <Link
                key={item.id}
                href={`/wardrobe/${item.id}`}
                className="relative aspect-square bg-warm-50 transition-opacity hover:opacity-90"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes={`(max-width: 768px) ${Math.round(100 / displayItems.length)}vw, ${Math.round(700 / displayItems.length)}px`}
                />
              </Link>
            ))}
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-3 w-3 text-emerald-600" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Today&apos;s Look
              </span>
            </div>
            <h3 className="mt-2 font-semibold text-warm-900">{displayName}</h3>
            {displayNote && (
              <p className="mt-1 text-sm leading-relaxed text-warm-500">
                {displayNote}
              </p>
            )}
            <button
              onClick={handleEdit}
              className="mt-3 text-xs font-medium text-blush-500 hover:text-blush-600"
            >
              Edit
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <StreakBadge streak={streak} />
          <Link
            href="/calendar"
            className="flex items-center gap-0.5 text-xs font-medium text-blush-500 hover:text-blush-600"
          >
            View Calendar <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    );
  }

  // --- Dismissed state ---
  if (isDismissed) {
    return (
      <section>
        <h2 className="mb-3 text-base font-semibold text-warm-900">
          Your daily look
        </h2>
        <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-warm-200/60">
          <p className="text-sm text-warm-500">
            No outfit logged yet today.
          </p>
          <div className="mt-3 flex items-center gap-4">
            <button
              onClick={handleUndismiss}
              className="text-xs font-medium text-blush-500 hover:text-blush-600"
            >
              See suggestion
            </button>
            <Link
              href="/calendar/log"
              className="text-xs font-medium text-blush-500 hover:text-blush-600"
            >
              Log a custom outfit
            </Link>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <StreakBadge streak={streak} />
          <Link
            href="/calendar"
            className="flex items-center gap-0.5 text-xs font-medium text-blush-500 hover:text-blush-600"
          >
            View Calendar <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    );
  }

  // --- Default: suggestion state ---
  const cols = imageGridCols(suggestionItems.length);

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-warm-900">
        Your daily look
      </h2>
      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60">
        <div className="p-4 pb-3">
          <WeatherContextBar
            temp={liveWeather?.temp ?? suggestion.weatherTemp}
            condition={liveWeather?.condition ?? suggestion.weatherCondition}
            description={liveWeather?.description ?? suggestion.weatherDescription}
          />
        </div>

        <div className={`grid ${cols} gap-px bg-warm-100`}>
          {suggestionItems.map((item) => (
            <Link
              key={item.id}
              href={`/wardrobe/${item.id}`}
              className="relative aspect-square bg-warm-50 transition-opacity hover:opacity-90"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes={`(max-width: 768px) ${Math.round(100 / suggestionItems.length)}vw, ${Math.round(700 / suggestionItems.length)}px`}
              />
            </Link>
          ))}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-warm-900">
            {suggestion.outfitName}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-warm-500">
            {suggestion.stylingNote}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={handleWearThis}
              className="flex items-center gap-1.5 rounded-full bg-blush-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-blush-600 active:scale-[0.97]"
            >
              <Check className="h-3.5 w-3.5" />
              Wearing This
            </button>
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 rounded-full bg-warm-100 px-4 py-2 text-xs font-medium text-warm-600 transition-all hover:bg-warm-200 active:scale-[0.97]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Shuffle
            </button>
            <button
              onClick={handleDismiss}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-warm-400 transition-all hover:bg-warm-100 hover:text-warm-500 active:scale-[0.97]"
            >
              <X className="h-3.5 w-3.5" />
              Not Today
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <StreakBadge streak={streak} />
        <Link
          href="/calendar"
          className="flex items-center gap-0.5 text-xs font-medium text-blush-500 hover:text-blush-600"
        >
          View Calendar <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
