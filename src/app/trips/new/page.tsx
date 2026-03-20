"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Backpack,
  Luggage,
  Package,
  Infinity,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { activities } from "@/data/trips";

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

  function toggleActivity(act: string) {
    setSelectedActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/trips/trip-1");
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
              className="w-full rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-sm text-warm-800 placeholder:text-warm-400 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
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
              className="w-full rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-sm text-warm-800 placeholder:text-warm-400 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-warm-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-sm text-warm-800 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
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
                className="w-full rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-sm text-warm-800 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
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

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blush-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blush-600"
        >
          <Sparkles className="h-4 w-4" />
          Generate Packing Plan
        </button>
      </form>
    </div>
  );
}
