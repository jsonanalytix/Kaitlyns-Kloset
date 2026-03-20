import type { ClothingItem } from "@/lib/queries/wardrobe";

interface ConversationMessage {
  sender: "user" | "ai";
  content: string;
}

interface OutfitSuggestion {
  name: string;
  itemIds: string[];
  explanation: string;
  occasion: string;
}

export interface StylistResponse {
  message: string;
  outfit?: OutfitSuggestion;
}

const STYLIST_URL = process.env.NEXT_PUBLIC_AI_STYLIST_URL || "";

export async function chatWithStylist(
  wardrobeItems: ClothingItem[],
  conversationHistory: ConversationMessage[],
  userMessage: string,
): Promise<StylistResponse> {
  if (!STYLIST_URL) {
    throw new Error("AI Stylist URL not configured");
  }

  const payload = {
    wardrobeItems: wardrobeItems.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      color: item.color,
      season: item.season,
      formality: item.formality,
      fabricWeight: item.fabricWeight,
      tags: item.tags,
    })),
    conversationHistory,
    userMessage,
  };

  const res = await fetch(`${STYLIST_URL}/api/stylist/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Stylist API error ${res.status}: ${body}`);
  }

  return res.json();
}
