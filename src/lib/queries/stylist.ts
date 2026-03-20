import { supabase } from "@/lib/supabase";
import { assertNotDemo } from "@/lib/demo";
import { getItemsByIds, type ClothingItem } from "./wardrobe";

export type { ClothingItem };

export interface StylistOutfit {
  id: string;
  name: string;
  occasion: string;
  itemIds: string[];
  explanation: string;
  savedDate: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  type: "text" | "outfit";
  content: string;
  outfitId?: string;
}

export const quickChips = [
  { label: "Date night", message: "I need an outfit for date night" },
  { label: "Work", message: "I need something professional for the office" },
  { label: "Casual", message: "Put together a casual everyday look for me" },
  {
    label: "Going out",
    message:
      "I\u2019m going out with friends tonight \u2014 something fun and stylish",
  },
  {
    label: "Travel day",
    message: "I need a comfortable but cute travel outfit",
  },
];

export async function getItemsForOutfit(
  itemIds: string[],
): Promise<ClothingItem[]> {
  return getItemsByIds(itemIds);
}

export async function getSavedOutfits(): Promise<StylistOutfit[]> {
  const { data, error } = await supabase
    .from("outfits")
    .select("*, outfit_items(item_id, position)")
    .eq("source", "ai_stylist")
    .eq("is_saved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => {
    const items =
      (row.outfit_items as { item_id: string; position: number }[] | null) ??
      [];
    return {
      id: row.id as string,
      name: row.name as string,
      occasion: (row.occasion as string) ?? "",
      itemIds: items
        .sort((a, b) => a.position - b.position)
        .map((oi) => oi.item_id),
      explanation: (row.description as string) ?? "",
      savedDate: ((row.created_at as string) ?? "").split("T")[0],
    };
  });
}

export async function getConversations(): Promise<
  { id: string; createdAt: string }[]
> {
  const { data, error } = await supabase
    .from("stylist_conversations")
    .select("id, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: { id: string; created_at: string }) => ({
    id: r.id,
    createdAt: r.created_at,
  }));
}

export async function getMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("stylist_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    sender: row.sender as "user" | "ai",
    type: row.type as "text" | "outfit",
    content: (row.content as string) ?? "",
    outfitId: (row.outfit_id as string) ?? undefined,
  }));
}

export async function getMessagesWithOutfits(
  conversationId: string,
): Promise<{
  messages: ChatMessage[];
  outfits: Record<string, StylistOutfit>;
}> {
  const { data, error } = await supabase
    .from("stylist_messages")
    .select(
      "*, outfit:outfit_id(id, name, occasion, description, created_at, outfit_items(item_id, position))",
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const messages: ChatMessage[] = [];
  const outfits: Record<string, StylistOutfit> = {};

  for (const row of data ?? []) {
    const r = row as Record<string, unknown>;
    messages.push({
      id: r.id as string,
      sender: r.sender as "user" | "ai",
      type: r.type as "text" | "outfit",
      content: (r.content as string) ?? "",
      outfitId: (r.outfit_id as string) ?? undefined,
    });

    if (r.outfit_id && r.outfit) {
      const outfit = r.outfit as Record<string, unknown>;
      const items =
        (outfit.outfit_items as
          | { item_id: string; position: number }[]
          | null) ?? [];
      outfits[r.outfit_id as string] = {
        id: outfit.id as string,
        name: outfit.name as string,
        occasion: (outfit.occasion as string) ?? "",
        itemIds: items
          .sort((a, b) => a.position - b.position)
          .map((i) => i.item_id),
        explanation: (outfit.description as string) ?? "",
        savedDate: ((outfit.created_at as string) ?? "").split("T")[0],
      };
    }
  }

  return { messages, outfits };
}

export async function createConversation(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("stylist_conversations")
    .insert({ user_id: user.id })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function sendMessage(
  conversationId: string,
  message: {
    sender: "user" | "ai";
    type: "text" | "outfit";
    content: string;
    outfitId?: string;
  },
): Promise<ChatMessage> {
  assertNotDemo();
  const { data, error } = await supabase
    .from("stylist_messages")
    .insert({
      conversation_id: conversationId,
      sender: message.sender,
      type: message.type,
      content: message.content,
      outfit_id: message.outfitId,
    })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    sender: data.sender,
    type: data.type,
    content: data.content ?? "",
    outfitId: data.outfit_id ?? undefined,
  };
}
