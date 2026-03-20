"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera, Check, ChevronLeft } from "lucide-react";
import ItemSelectorGrid from "./ItemSelectorGrid";
import { clothingItems } from "@/data/wardrobe";
import type { ClothingItem } from "@/data/wardrobe";

const OCCASIONS = ["Work", "Casual", "Date Night", "Special Event", "Workout", "Travel"];

interface OutfitLoggerProps {
  preSelectedItemIds?: string[];
  date?: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function OutfitLogger({
  preSelectedItemIds = [],
  date,
}: OutfitLoggerProps) {
  const router = useRouter();
  const targetDate = date || todayISO();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>(preSelectedItemIds);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [mood, setMood] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const selectedItems = selectedIds
    .map((id) => clothingItems.find((item) => item.id === id))
    .filter((item): item is ClothingItem => item != null);

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  }, []);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
  }

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function handleSave() {
    setStep(3);
  }

  useEffect(() => {
    if (step !== 3) return;
    const timeout = setTimeout(() => {
      router.push(date ? "/calendar" : "/");
    }, 2200);
    return () => clearTimeout(timeout);
  }, [step, date, router]);

  // ── Step 3: Success ──

  if (step === 3) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
        <SuccessAnimation />
      </div>
    );
  }

  // ── Step 2: Add Context ──

  if (step === 2) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 lg:px-6 lg:py-8">
        <div>
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-500 transition-colors hover:text-warm-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to items
          </button>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-warm-900">
            Add Details
          </h1>
          <p className="mt-1 text-sm text-warm-500">
            {formatDate(targetDate)} &mdash; {selectedIds.length} item
            {selectedIds.length !== 1 && "s"}
          </p>
        </div>

        <StepIndicator current={2} />

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-warm-200/60"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-warm-800">Occasion</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                onClick={() => setOccasion(occasion === o ? null : o)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all active:scale-[0.97] ${
                  occasion === o
                    ? "bg-blush-500 text-white shadow-sm"
                    : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-warm-800">
            Mood / Vibe
            <span className="ml-1.5 text-xs font-normal text-warm-400">
              optional
            </span>
          </h2>
          <input
            type="text"
            placeholder="Felt confident, Cozy day, Ready to conquer..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="mt-2 w-full rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-base text-warm-800 placeholder:text-warm-400 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100 sm:text-sm"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-warm-800">
            Outfit Photo
            <span className="ml-1.5 text-xs font-normal text-warm-400">
              optional
            </span>
          </h2>
          {photoPreview ? (
            <div className="relative mt-2 aspect-[3/4] w-40 overflow-hidden rounded-2xl ring-1 ring-warm-200/60">
              <Image
                src={photoPreview}
                alt="Outfit photo"
                fill
                className="object-cover"
                sizes="160px"
              />
              <button
                onClick={() => {
                  URL.revokeObjectURL(photoPreview);
                  setPhotoPreview(null);
                }}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-warm-800/60 text-white backdrop-blur-sm transition-colors hover:bg-warm-800/80"
              >
                <span className="text-sm font-bold leading-none">&times;</span>
              </button>
            </div>
          ) : (
            <label className="mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-warm-200 bg-warm-50/50 p-8 transition-colors hover:border-blush-300 hover:bg-blush-50/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-100">
                <Camera className="h-5 w-5 text-warm-400" />
              </div>
              <span className="text-xs font-medium text-warm-500">
                Tap to add a mirror selfie
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setStep(1)}
            className="rounded-full bg-warm-100 px-5 py-2.5 text-xs font-medium text-warm-600 transition-all hover:bg-warm-200 active:scale-[0.97]"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-blush-500 px-5 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-blush-600 active:scale-[0.97]"
          >
            <Check className="h-3.5 w-3.5" />
            Save Outfit
          </button>
        </div>
      </div>
    );
  }

  // ── Step 1: Select Items ──

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-6 lg:px-6 lg:py-8">
      <div>
        <Link
          href={date ? "/calendar" : "/"}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-500 transition-colors hover:text-warm-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {date ? "Calendar" : "Home"}
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-warm-900">
          Log Outfit
        </h1>
        <p className="mt-1 text-sm text-warm-500">
          {formatDate(targetDate)} &mdash; Select the items you wore
        </p>
      </div>

      <StepIndicator current={1} />

      <ItemSelectorGrid
        selectedIds={selectedIds}
        onToggle={handleToggle}
        onRemove={handleRemove}
      />

      <div className="pt-2">
        <button
          onClick={() => setStep(2)}
          disabled={selectedIds.length === 0}
          className={`w-full rounded-full px-5 py-3 text-sm font-medium shadow-sm transition-all active:scale-[0.97] ${
            selectedIds.length > 0
              ? "bg-blush-500 text-white hover:bg-blush-600"
              : "cursor-not-allowed bg-warm-200 text-warm-400"
          }`}
        >
          {selectedIds.length > 0
            ? `Next — ${selectedIds.length} item${selectedIds.length !== 1 ? "s" : ""} selected`
            : "Select at least one item"}
        </button>
      </div>
    </div>
  );
}

// ── Shared sub-components ──

function StepIndicator({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2">
      {current === 1 ? (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blush-500 text-[11px] font-bold text-white">
          1
        </span>
      ) : (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blush-100 text-blush-500">
          <Check className="h-3 w-3" />
        </span>
      )}
      <span
        className={`text-xs font-medium ${current === 1 ? "text-warm-700" : "text-blush-500"}`}
      >
        Pick items
      </span>
      <div
        className={`mx-1 h-px flex-1 ${current === 2 ? "bg-blush-300" : "bg-warm-200"}`}
      />
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
          current === 2
            ? "bg-blush-500 text-white"
            : "bg-warm-200 text-warm-400"
        }`}
      >
        2
      </span>
      <span
        className={`text-xs font-medium ${current === 2 ? "text-warm-700" : "text-warm-400"}`}
      >
        Add details
      </span>
    </div>
  );
}

const CONFETTI_DOTS = [
  { style: { top: "-14px", left: "-10px" }, bg: "bg-blush-400", delay: "0.35s", size: "h-2 w-2" },
  { style: { top: "-12px", right: "-6px" }, bg: "bg-blush-300", delay: "0.4s", size: "h-1.5 w-1.5" },
  { style: { bottom: "-8px", left: "-14px" }, bg: "bg-warm-300", delay: "0.5s", size: "h-2 w-2" },
  { style: { bottom: "-10px", right: "-10px" }, bg: "bg-blush-500", delay: "0.38s", size: "h-1.5 w-1.5" },
  { style: { top: "-18px", left: "36px" }, bg: "bg-warm-400", delay: "0.42s", size: "h-1.5 w-1.5" },
  { style: { bottom: "-4px", left: "-18px" }, bg: "bg-blush-200", delay: "0.55s", size: "h-2.5 w-2.5" },
  { style: { top: "0px", right: "-18px" }, bg: "bg-blush-100", delay: "0.48s", size: "h-2 w-2" },
];

function SuccessAnimation() {
  return (
    <>
      <style>{`
        @keyframes kk-scale-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes kk-ring-expand {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes kk-ring-expand-sm {
          0% { transform: scale(1); opacity: 0.25; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes kk-check-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes kk-fade-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes kk-confetti-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
      `}</style>
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-blush-200"
            style={{ animation: "kk-ring-expand 0.9s ease-out 0.3s both" }}
          />
          <div
            className="absolute inset-0 rounded-full bg-blush-100"
            style={{ animation: "kk-ring-expand-sm 0.7s ease-out 0.15s both" }}
          />

          {CONFETTI_DOTS.map((dot, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${dot.bg} ${dot.size}`}
              style={{
                ...dot.style,
                animation: `kk-confetti-pop 0.6s ease-out ${dot.delay} both`,
              }}
            />
          ))}

          <div
            className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blush-500 shadow-lg"
            style={{
              animation:
                "kk-scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 24,
                  animation: "kk-check-draw 0.4s ease-out 0.4s both",
                }}
              />
            </svg>
          </div>
        </div>

        <div style={{ animation: "kk-fade-up 0.5s ease-out 0.6s both" }}>
          <h2 className="mt-8 text-center text-xl font-bold text-warm-900">
            Outfit Logged!
          </h2>
          <p className="mt-2 text-center text-sm text-warm-500">
            Looking great today
          </p>
        </div>
      </div>
    </>
  );
}
