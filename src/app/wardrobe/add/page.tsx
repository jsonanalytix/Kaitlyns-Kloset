"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  ImageIcon,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

const categoryOptions = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"];
const seasonOptions = ["Spring", "Summer", "Fall", "Winter", "All-season"];
const formalityOptions = ["Casual", "Smart-casual", "Formal"];
const colorSwatches = [
  { name: "Black", hex: "#1C1C1C" },
  { name: "White", hex: "#FAFAFA" },
  { name: "Cream", hex: "#F5F0E6" },
  { name: "Blush", hex: "#E8C4C0" },
  { name: "Navy", hex: "#2C3E6B" },
  { name: "Sage", hex: "#9CAF88" },
  { name: "Camel", hex: "#C4956A" },
  { name: "Brown", hex: "#8B6F4E" },
  { name: "Red", hex: "#C44D4D" },
  { name: "Blue", hex: "#6B8EAD" },
  { name: "Olive", hex: "#6B7B3F" },
  { name: "Charcoal", hex: "#4A4A4A" },
];

const MOCK_PREVIEW = "https://picsum.photos/seed/new-item-upload/400/500";

const steps = [
  { number: 1, label: "Photo" },
  { number: 2, label: "Details" },
  { number: 3, label: "Review" },
];

export default function AddItemPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    color: "",
    colorHex: "",
    seasons: [] as string[],
    formality: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");

  const toggleSeason = (season: string) => {
    setFormData((prev) => ({
      ...prev,
      seasons: prev.seasons.includes(season)
        ? prev.seasons.filter((s) => s !== season)
        : [...prev.seasons, season],
    }));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => {
      router.push("/wardrobe");
    }, 1500);
  };

  const canProceedStep1 = photoUploaded;
  const canProceedStep2 = formData.name && formData.category && formData.color;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 lg:px-6 lg:py-8">
      {/* Progress indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                currentStep > step.number
                  ? "bg-blush-500 text-white"
                  : currentStep === step.number
                    ? "bg-blush-500 text-white"
                    : "bg-warm-100 text-warm-400"
              }`}
            >
              {currentStep > step.number ? (
                <Check className="h-4 w-4" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`text-xs font-medium ${
                currentStep >= step.number ? "text-warm-800" : "text-warm-400"
              }`}
            >
              {step.label}
            </span>
            {idx < steps.length - 1 && (
              <div
                className={`mx-1 h-px w-8 ${
                  currentStep > step.number ? "bg-blush-400" : "bg-warm-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Photo */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-warm-900">Add a photo</h2>
          <p className="text-sm text-warm-500">
            Upload a photo of your clothing item.
          </p>

          {!photoUploaded ? (
            <button
              onClick={() => setPhotoUploaded(true)}
              className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-warm-300 bg-warm-50 px-6 py-16 transition-colors hover:border-blush-300 hover:bg-blush-50/30"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warm-100">
                <Camera className="h-7 w-7 text-warm-400" />
              </div>
              <span className="text-sm font-medium text-warm-600">
                Tap to upload a photo
              </span>
              <span className="text-xs text-warm-400">
                JPG, PNG, or HEIC up to 10MB
              </span>
            </button>
          ) : (
            <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl bg-warm-100 shadow-sm ring-1 ring-warm-200/60">
              <div className="relative aspect-[4/5]">
                <Image
                  src={MOCK_PREVIEW}
                  alt="Uploaded item preview"
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
              <button
                onClick={() => setPhotoUploaded(false)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-warm-900/50 text-white backdrop-blur-sm transition-colors hover:bg-warm-900/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setPhotoUploaded(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-blush-500 hover:text-blush-600"
          >
            <ImageIcon className="h-4 w-4" />
            Choose from gallery
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {currentStep === 2 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-warm-900">
            Add item details
          </h2>

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">
              Item name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Cream Linen Blouse"
              className="w-full rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-sm text-warm-800 placeholder:text-warm-400 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full appearance-none rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-sm text-warm-800 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
            >
              <option value="">Select a category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorSwatches.map((swatch) => (
                <button
                  key={swatch.name}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      color: swatch.name,
                      colorHex: swatch.hex,
                    }))
                  }
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    formData.color === swatch.name
                      ? "bg-blush-50 text-blush-700 ring-2 ring-blush-300"
                      : "bg-warm-50 text-warm-600 hover:bg-warm-100"
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full ring-1 ring-warm-300"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  {swatch.name}
                </button>
              ))}
            </div>
          </div>

          {/* Season (multi-select) */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">
              Season
            </label>
            <div className="flex flex-wrap gap-2">
              {seasonOptions.map((season) => (
                <button
                  key={season}
                  onClick={() => toggleSeason(season)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    formData.seasons.includes(season)
                      ? "bg-blush-500 text-white"
                      : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          {/* Formality (single-select) */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">
              Formality
            </label>
            <div className="flex gap-2">
              {formalityOptions.map((level) => (
                <button
                  key={level}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, formality: level }))
                  }
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    formData.formality === level
                      ? "bg-blush-500 text-white"
                      : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Custom tags */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">
              Custom tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type a tag and press Enter"
                className="flex-1 rounded-xl border border-warm-200 bg-surface px-4 py-2.5 text-sm text-warm-800 placeholder:text-warm-400 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
              />
              <button
                onClick={addTag}
                className="rounded-xl bg-blush-50 px-4 py-2.5 text-sm font-medium text-blush-600 transition-colors hover:bg-blush-100"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-blush-50 px-2.5 py-1 text-xs font-medium text-blush-600"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="rounded-full p-0.5 hover:bg-blush-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-warm-900">Review &amp; save</h2>
          <p className="text-sm text-warm-500">
            Make sure everything looks right before saving.
          </p>

          <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-warm-200/60">
            <div className="relative aspect-[4/5] w-full max-w-xs mx-auto bg-warm-100">
              <Image
                src={MOCK_PREVIEW}
                alt="Item preview"
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
            <div className="space-y-3 p-5">
              <h3 className="text-lg font-semibold text-warm-900">
                {formData.name || "Untitled Item"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.category && (
                  <span className="rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-600">
                    {formData.category}
                  </span>
                )}
                {formData.color && (
                  <span className="flex items-center gap-1.5 rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600">
                    <span
                      className="h-2.5 w-2.5 rounded-full ring-1 ring-warm-300"
                      style={{ backgroundColor: formData.colorHex }}
                    />
                    {formData.color}
                  </span>
                )}
                {formData.seasons.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600"
                  >
                    {s}
                  </span>
                ))}
                {formData.formality && (
                  <span className="rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600">
                    {formData.formality}
                  </span>
                )}
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 flex gap-3">
        {currentStep > 1 ? (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-warm-200 bg-surface py-3 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <button
            onClick={() => router.push("/wardrobe")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-warm-200 bg-surface py-3 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </button>
        )}

        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={
              (currentStep === 1 && !canProceedStep1) ||
              (currentStep === 2 && !canProceedStep2)
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blush-500 py-3 text-sm font-medium text-white transition-colors hover:bg-blush-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blush-500 py-3 text-sm font-medium text-white transition-colors hover:bg-blush-600"
          >
            <Check className="h-4 w-4" />
            Save to Wardrobe
          </button>
        )}
      </div>

      {/* Success toast */}
      {showToast && (
        <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 lg:bottom-8">
          <div className="flex items-center gap-2 rounded-full bg-warm-800 px-5 py-3 text-sm font-medium text-white shadow-lg">
            <Check className="h-4 w-4 text-green-400" />
            Item saved to your wardrobe!
          </div>
        </div>
      )}
    </div>
  );
}
