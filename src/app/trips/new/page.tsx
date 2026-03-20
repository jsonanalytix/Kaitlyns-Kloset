"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Backpack,
  Luggage,
  Package,
  Infinity,
  Sparkles,
  Loader2,
  CloudSun,
} from "lucide-react";
import Link from "next/link";
import { activities, createTrip } from "@/lib/queries/trips";
import {
  getForecast,
  type ForecastDay,
  type ForecastResponse,
} from "@/lib/api/weather";

const luggageChoices = [
  { id: "backpack", label: "Backpack", Icon: Backpack },
  { id: "carry-on", label: "Carry-on", Icon: Luggage },
  { id: "carry-on-checked", label: "Carry-on + Checked", Icon: Package },
  { id: "no-restrictions", label: "No Limits", Icon: Infinity },
] as const;

export default function NewTripPage() {
  const router = useRouter();
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [luggage, setLuggage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  useEffect(() => {
    if (!destination || destination.length < 3) {
      setForecast(null);
      return;
    }
    const timer = setTimeout(() => {
      setForecastLoading(true);
      getForecast(destination, 5)
        .then(setForecast)
        .catch(() => setForecast(null))
        .finally(() => setForecastLoading(false));
    }, 800);
    return () => clearTimeout(timer);
  }, [destination]);

  function toggleActivity(act: string) {
    setSelectedActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  }

  function summarizeForecast(days: ForecastDay[]) {
    if (days.length === 0) return { summary: "", high: 0, low: 0 };
    const high = Math.max(...days.map((d) => d.high));
    const low = Math.min(...days.map((d) => d.low));
    const conditions = days.map((d) => d.condition);
    const dominant = conditions
      .sort((a, b) =>
        conditions.filter((c) => c === a).length -
        conditions.filter((c) => c === b).length
      )
      .pop() ?? "";
    return {
      summary: `${dominant}, highs around ${high}\u00B0F`,
      high,
      low,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const weather = forecast
        ? summarizeForecast(forecast.forecast)
        : { summary: "", high: 0, low: 0 };

      const trip = await createTrip({
        name: tripName,
        destination,
        startDate,
        endDate,
        activities: selectedActivities,
        luggageType: luggage,
        weatherSummary: weather.summary,
        weatherHigh: weather.high,
        weatherLow: weather.low,
      });

      router.push(`/trips/${trip.id}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to create trip");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 lg:px-6 lg:py-8">
      <Link
        href="/trips"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-500 transition-colors hover:text-warm-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to trips
      </Link>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-warm-900">
        Plan a New Trip
      </h1>
      <p className="mt-1 text-sm text-warm-500">
        Tell us about your trip and we&apos;ll build a smart packing plan
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">
              Trip Name
            </label>
            <input
              type="text"
              placeholder="e.g., Weekend in Austin"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="w-full rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-base sm:text-sm text-warm-800 placeholder:text-warm-400 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">
              Destination
            </label>
            <input
              type="text"
              placeholder="e.g., Austin, TX"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-base sm:text-sm text-warm-800 placeholder:text-warm-400 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
            />
          </div>

          {/* Forecast preview */}
          {(forecastLoading || forecast) && (
            <div className="rounded-xl bg-warm-50 p-3 ring-1 ring-warm-200/60">
              <div className="flex items-center gap-2 text-xs font-medium text-warm-600">
                <CloudSun className="h-3.5 w-3.5" />
                {forecastLoading ? "Loading forecast..." : `${forecast!.location} forecast`}
              </div>
              {forecast && (
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {forecast.forecast.slice(0, 5).map((day) => (
                    <div
                      key={day.date}
                      className="flex shrink-0 flex-col items-center gap-0.5 rounded-lg bg-surface px-3 py-2 text-center ring-1 ring-warm-200/60"
                    >
                      <span className="text-[10px] text-warm-400">
                        {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className="text-xs font-semibold text-warm-800">
                        {day.high}&deg;
                      </span>
                      <span className="text-[10px] text-warm-400">
                        {day.low}&deg;
                      </span>
                      <span className="text-[10px] text-warm-500">
                        {day.condition}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-warm-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-base sm:text-sm text-warm-800 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-warm-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-base sm:text-sm text-warm-800 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-warm-700">
            Activities
          </label>
          <div className="flex flex-wrap gap-2">
            {activities.map((act) => (
              <button
                key={act}
                type="button"
                onClick={() => toggleActivity(act)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedActivities.includes(act)
                    ? "bg-blush-500 text-white shadow-sm"
                    : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-warm-700">
            Luggage Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {luggageChoices.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setLuggage(id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-colors ${
                  luggage === id
                    ? "border-blush-500 bg-blush-50 text-blush-600"
                    : "border-warm-200 bg-surface text-warm-500 hover:border-warm-300 hover:bg-warm-50"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blush-500 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blush-600 active:bg-blush-600 active:scale-[0.98] disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {submitting ? "Creating..." : "Generate Packing Plan"}
        </button>
      </form>
    </div>
  );
}
