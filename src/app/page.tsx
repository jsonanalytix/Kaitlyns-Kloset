"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Luggage, Plus, ChevronRight, Shirt, FolderOpen, CalendarPlus } from "lucide-react";
import { clothingItems, wardrobeStats } from "@/data/wardrobe";
import DailyLookModule from "@/components/DailyLookModule";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const quickActions = [
  {
    label: "Plan an outfit",
    href: "/stylist",
    icon: Sparkles,
    gradient: "from-blush-100 to-blush-50",
  },
  {
    label: "Start packing",
    href: "/trips",
    icon: Luggage,
    gradient: "from-warm-100 to-warm-50",
  },
  {
    label: "Add to wardrobe",
    href: "/wardrobe/add",
    icon: Plus,
    gradient: "from-blush-50 to-warm-50",
  },
];

const recentItems = clothingItems
  .sort((a, b) => a.addedDaysAgo - b.addedDaysAgo)
  .slice(0, 6);

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-6 lg:px-6 lg:py-8">
      {/* Greeting */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-warm-900">
          {getGreeting()}, Kaitlyn
        </h1>
        <p className="mt-0.5 text-sm text-warm-500">{formatDate()}</p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-3">
        {quickActions.map(({ label, href, icon: Icon, gradient }) => (
          <Link
            key={href}
            href={href}
            className={`group flex flex-col items-center gap-2.5 rounded-2xl bg-gradient-to-b ${gradient} p-4 text-center transition-all hover:shadow-md active:scale-[0.97]`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface shadow-sm">
              <Icon className="h-5 w-5 text-blush-500" />
            </div>
            <span className="text-xs font-medium leading-tight text-warm-700">
              {label}
            </span>
          </Link>
        ))}
      </section>

      {/* Your Daily Look */}
      <DailyLookModule />

      {/* Recently Added */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-warm-900">
            Recently added
          </h2>
          <Link
            href="/wardrobe"
            className="flex items-center gap-0.5 text-xs font-medium text-blush-500 hover:text-blush-600"
          >
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {recentItems.map((item) => (
            <div key={item.id} className="w-28 shrink-0">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-warm-100">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <p className="mt-1.5 truncate text-xs font-medium text-warm-800">
                {item.name}
              </p>
              <p className="text-[10px] text-warm-400">{item.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wardrobe at a Glance */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-warm-900">
          Wardrobe at a glance
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total items",
              value: wardrobeStats.totalItems,
              icon: Shirt,
            },
            {
              label: "Categories",
              value: wardrobeStats.categories,
              icon: FolderOpen,
            },
            {
              label: "Added this month",
              value: wardrobeStats.addedThisMonth,
              icon: CalendarPlus,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-warm-200/60"
            >
              <Icon className="h-4.5 w-4.5 text-blush-400" />
              <span className="text-xl font-bold text-warm-900">{value}</span>
              <span className="text-[11px] text-warm-400">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
