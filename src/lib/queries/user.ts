import { supabase } from "@/lib/supabase";
import { assertNotDemo } from "@/lib/demo";

export interface UserProfile {
  name: string;
  avatarUrl: string;
  memberSince: string;
  stats: {
    totalItems: number;
    outfitsSaved: number;
    tripsPlanned: number;
  };
}

export interface GapSuggestion {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface InsightsData {
  wardrobeScore: number;
  scoreLabel: string;
  categoryBreakdown: { category: string; count: number; color: string }[];
  gapSuggestions: GapSuggestion[];
  underusedItemIds: string[];
  seasonalReadiness: {
    season: string;
    message: string;
    ready: boolean;
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Tops: "#C9918F",
  Bottoms: "#E4BAB4",
  Dresses: "#D49B94",
  Outerwear: "#B27472",
  Shoes: "#9E938B",
  Accessories: "#7A706A",
};

export async function getProfile(): Promise<UserProfile> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const [{ count: totalItems }, { count: outfitsSaved }, { count: tripsPlanned }] =
    await Promise.all([
      supabase
        .from("wardrobe_items")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("outfits")
        .select("*", { count: "exact", head: true })
        .eq("is_saved", true),
      supabase.from("trips").select("*", { count: "exact", head: true }),
    ]);

  const createdAt = profile?.created_at
    ? new Date(profile.created_at)
    : new Date(user.created_at ?? Date.now());
  const memberSince = createdAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return {
    name: profile?.name ?? user.user_metadata?.full_name ?? "User",
    avatarUrl:
      profile?.avatar_url ?? user.user_metadata?.avatar_url ?? "/kait.png",
    memberSince,
    stats: {
      totalItems: totalItems ?? 0,
      outfitsSaved: outfitsSaved ?? 0,
      tripsPlanned: tripsPlanned ?? 0,
    },
  };
}

export async function updateProfile(updates: {
  name?: string;
  avatarUrl?: string;
}): Promise<void> {
  assertNotDemo();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const payload: Record<string, string> = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;

  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id);
  if (error) throw error;
}

export async function getInsights(): Promise<InsightsData> {
  const { data: items } = await supabase
    .from("wardrobe_items")
    .select("id, category, wear_count, season");

  const categoryCounts: Record<string, number> = {};
  for (const item of items ?? []) {
    const cat = (item as { category: string }).category;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }
  const categoryBreakdown = Object.entries(categoryCounts).map(
    ([category, count]) => ({
      category,
      count,
      color: CATEGORY_COLORS[category] ?? "#9E938B",
    }),
  );

  const sortedByWear = [...(items ?? [])].sort(
    (a, b) =>
      ((a as { wear_count: number }).wear_count ?? 0) -
      ((b as { wear_count: number }).wear_count ?? 0),
  );
  const underusedItemIds = sortedByWear
    .filter((i) => ((i as { wear_count: number }).wear_count ?? 0) <= 2)
    .slice(0, 4)
    .map((i) => (i as { id: string }).id);

  const totalItems = items?.length ?? 0;
  const categoryCount = Object.keys(categoryCounts).length;
  const balanceScore = Math.min(categoryCount * 15, 50);
  const sizeScore = Math.min(totalItems * 2, 30);
  const diversityScore = underusedItemIds.length <= 2 ? 20 : 10;
  const wardrobeScore = Math.min(
    balanceScore + sizeScore + diversityScore,
    100,
  );
  const scoreLabel =
    wardrobeScore >= 80
      ? "Excellent wardrobe"
      : wardrobeScore >= 60
        ? "Well-rounded wardrobe"
        : wardrobeScore >= 40
          ? "Growing wardrobe"
          : "Just getting started";

  return {
    wardrobeScore,
    scoreLabel,
    categoryBreakdown,
    gapSuggestions: computeGapSuggestions(categoryCounts),
    underusedItemIds,
    seasonalReadiness: computeSeasonalReadiness(items ?? []),
  };
}

function computeGapSuggestions(
  categoryCounts: Record<string, number>,
): GapSuggestion[] {
  const suggestions: GapSuggestion[] = [];

  if ((categoryCounts["Outerwear"] ?? 0) < 3) {
    suggestions.push({
      id: "gap-rain",
      title: "Rain Jacket",
      description:
        "A lightweight rain jacket would make your wardrobe ready for spring showers.",
      icon: "cloud-rain",
    });
  }
  if ((categoryCounts["Shoes"] ?? 0) < 4) {
    suggestions.push({
      id: "gap-sandals",
      title: "Versatile Flat Sandals",
      description:
        "A pair of flat sandals would complement many items for warm-weather outfits.",
      icon: "sun",
    });
  }
  if (suggestions.length === 0) {
    suggestions.push({
      id: "gap-neutral",
      title: "Neutral Blazer",
      description:
        "A neutral blazer would unlock smart-casual outfits for work and evenings out.",
      icon: "briefcase",
    });
  }
  return suggestions;
}

function computeSeasonalReadiness(
  items: Record<string, unknown>[],
): InsightsData["seasonalReadiness"] {
  const m = new Date().getMonth() + 1;
  const season =
    m >= 3 && m <= 5
      ? "Spring"
      : m >= 6 && m <= 8
        ? "Summer"
        : m >= 9 && m <= 11
          ? "Fall"
          : "Winter";

  const seasonItems = items.filter(
    (i) =>
      (i as { season: string }).season === season ||
      (i as { season: string }).season === "All-season",
  );
  const ready = seasonItems.length >= 10;

  return {
    season,
    message: ready
      ? `${season} is here \u2014 your wardrobe looks ready!`
      : `${season} is coming \u2014 you might want to add a few more ${season.toLowerCase()} pieces.`,
    ready,
  };
}
