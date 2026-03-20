"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OutfitLogger from "@/components/OutfitLogger";

function LogOutfitContent() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") ?? undefined;
  const items = searchParams.get("items");
  const preSelectedItemIds = items ? items.split(",").filter(Boolean) : [];

  return (
    <OutfitLogger date={date} preSelectedItemIds={preSelectedItemIds} />
  );
}

function LogOutfitSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-6 lg:px-6 lg:py-8">
      <div className="h-6 w-20 rounded bg-warm-100" />
      <div className="h-8 w-48 rounded bg-warm-100" />
      <div className="h-4 w-64 rounded bg-warm-100" />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] rounded-xl bg-warm-100 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default function LogOutfitPage() {
  return (
    <Suspense fallback={<LogOutfitSkeleton />}>
      <LogOutfitContent />
    </Suspense>
  );
}
