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

export const userProfile: UserProfile = {
  name: "Kaitlyn",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  memberSince: "January 2026",
  stats: {
    totalItems: 47,
    outfitsSaved: 12,
    tripsPlanned: 3,
  },
};

export const insightsData: InsightsData = {
  wardrobeScore: 72,
  scoreLabel: "Well-rounded wardrobe",
  categoryBreakdown: [
    { category: "Tops", count: 6, color: "#C9918F" },
    { category: "Bottoms", count: 5, color: "#E4BAB4" },
    { category: "Dresses", count: 3, color: "#D49B94" },
    { category: "Outerwear", count: 5, color: "#B27472" },
    { category: "Shoes", count: 3, color: "#9E938B" },
    { category: "Accessories", count: 4, color: "#7A706A" },
  ],
  gapSuggestions: [
    {
      id: "gap-1",
      title: "Neutral Blazer",
      description:
        "You don't have a neutral blazer — this would unlock 5+ smart-casual outfits for work and evenings out.",
      icon: "briefcase",
    },
    {
      id: "gap-2",
      title: "Rain Jacket",
      description:
        "A lightweight rain jacket would make your wardrobe ready for spring showers without adding bulk.",
      icon: "cloud-rain",
    },
    {
      id: "gap-3",
      title: "Versatile Flat Sandals",
      description:
        "A pair of flat sandals in tan or black would complement 8 items in your wardrobe for warm-weather outfits.",
      icon: "sun",
    },
  ],
  underusedItemIds: ["23", "9", "18", "24"],
  seasonalReadiness: {
    season: "Spring",
    message:
      "Spring is coming — you're set on lightweight tops but could use a rain jacket and a pair of versatile sandals.",
    ready: false,
  },
};
