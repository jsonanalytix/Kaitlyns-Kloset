"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Luggage, Plus } from "lucide-react";
import { trips } from "@/data/trips";

function formatDateRange(start: string, end: string) {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const sMonth = s.toLocaleDateString("en-US", { month: "short" });
  const eMonth = e.toLocaleDateString("en-US", { month: "short" });
  const sDay = s.getDate();
  const eDay = e.getDate();
  if (sMonth === eMonth) return `${sMonth} ${sDay}–${eDay}, ${s.getFullYear()}`;
  return `${sMonth} ${sDay} – ${eMonth} ${eDay}, ${s.getFullYear()}`;
}

export default function TripsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-warm-900">
            Trip Planner
          </h1>
          <p className="mt-1 text-sm text-warm-500">
            Smart packing lists for every adventure
          </p>
        </div>
        <Link
          href="/trips/new"
          className="flex items-center gap-2 rounded-xl bg-blush-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blush-600"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Trip</span>
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            href={`/trips/${trip.id}`}
            className="group block overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60 transition-shadow hover:shadow-md"
          >
            <div className="relative h-40 overflow-hidden bg-warm-100 sm:h-48">
              <Image
                src={trip.coverImage}
                alt={trip.destination}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 700px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-lg font-bold text-white">{trip.name}</h2>
                <div className="mt-1 flex items-center gap-1.5 text-white/80">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-sm">{trip.destination}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 text-sm text-warm-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-warm-400" />
                  <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Luggage className="h-4 w-4 text-warm-400" />
                  <span>{trip.luggageLabel}</span>
                </div>
              </div>
              <span className="rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-600">
                {trip.totalItems} items packed
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
