import { MapPin } from "lucide-react";

export default function TripsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blush-50">
        <MapPin className="h-8 w-8 text-blush-400" />
      </div>
      <h1 className="mt-5 text-xl font-bold text-warm-900">Trip Planner</h1>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-warm-500">
        Plan smart packing lists for any trip — optimized for mix-and-match
        outfits that fit your luggage.
      </p>
      <span className="mt-4 inline-block rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-500">
        Coming in Phase 4
      </span>
    </div>
  );
}
