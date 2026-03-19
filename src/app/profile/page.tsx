import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blush-50">
        <User className="h-8 w-8 text-blush-400" />
      </div>
      <h1 className="mt-5 text-xl font-bold text-warm-900">
        Profile &amp; Insights
      </h1>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-warm-500">
        View your wardrobe stats, style insights, gap analysis, and personal
        settings.
      </p>
      <span className="mt-4 inline-block rounded-full bg-blush-50 px-3 py-1 text-xs font-medium text-blush-500">
        Coming in Phase 4
      </span>
    </div>
  );
}
