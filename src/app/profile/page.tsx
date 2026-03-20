"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  Clock,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
  Shirt,
  Heart,
  MapPin,
} from "lucide-react";
import { userProfile } from "@/data/user";

const menuItems = [
  {
    label: "Wardrobe Insights",
    href: "/profile/insights",
    icon: BarChart3,
    description: "Score, gap analysis & style tips",
  },
  {
    label: "Outfit Calendar",
    href: "/calendar",
    icon: CalendarDays,
    description: "Your daily outfit diary",
  },
  {
    label: "Outfit History",
    href: "/profile",
    icon: Clock,
    description: "Past outfits and what you wore",
  },
  {
    label: "Preferences",
    href: "/profile",
    icon: Settings,
    description: "Style preferences and sizes",
  },
  {
    label: "Notifications",
    href: "/profile",
    icon: Bell,
    description: "Daily suggestions & trip reminders",
  },
  {
    label: "Help & Feedback",
    href: "/profile",
    icon: HelpCircle,
    description: "Get support or share ideas",
  },
];

const statItems = [
  { label: "Items", value: userProfile.stats.totalItems, icon: Shirt },
  { label: "Outfits saved", value: userProfile.stats.outfitsSaved, icon: Heart },
  { label: "Trips planned", value: userProfile.stats.tripsPlanned, icon: MapPin },
];

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
      {/* User card */}
      <div className="flex flex-col items-center rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-warm-200/60">
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-warm-100 ring-4 ring-blush-100">
          <Image
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <h1 className="mt-3 text-xl font-bold text-warm-900">
          {userProfile.name}
        </h1>
        <p className="mt-0.5 text-sm text-warm-400">
          Member since {userProfile.memberSince}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {statItems.map(({ label, value, icon: Icon }) => (
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

      {/* Menu */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-warm-50/50 active:bg-warm-100 ${
                index < menuItems.length - 1
                  ? "border-b border-warm-100"
                  : ""
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blush-50">
                <Icon className="h-4.5 w-4.5 text-blush-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-warm-800">
                  {item.label}
                </p>
                <p className="text-xs text-warm-400">{item.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-warm-300" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
