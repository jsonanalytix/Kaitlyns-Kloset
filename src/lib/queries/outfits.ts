import { supabase } from "@/lib/supabase";
import { assertNotDemo } from "@/lib/demo";

export interface Outfit {
  id: string;
  name: string;
  description: string;
  occasion: string;
  itemIds: string[];
  date: string;
}

interface OutfitRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  occasion: string | null;
  source: string;
  is_saved: boolean;
  created_at: string;
}

interface OutfitItemRow {
  item_id: string;
  position: number;
}

function toOutfit(row: OutfitRow, itemIds: string[]): Outfit {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    occasion: row.occasion ?? "",
    itemIds,
    date: row.created_at?.split("T")[0] ?? "",
  };
}

export async function getOutfits(): Promise<Outfit[]> {
  const { data, error } = await supabase
    .from("outfits")
    .select("*, outfit_items(item_id, position)")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map(
    (row: OutfitRow & { outfit_items: OutfitItemRow[] }) => {
      const itemIds = (row.outfit_items ?? [])
        .sort((a, b) => a.position - b.position)
        .map((oi) => oi.item_id);
      return toOutfit(row, itemIds);
    },
  );
}

export async function getOutfitsForItem(itemId: string): Promise<Outfit[]> {
  const { data: links, error: linkErr } = await supabase
    .from("outfit_items")
    .select("outfit_id")
    .eq("item_id", itemId);
  if (linkErr) throw linkErr;
  if (!links || links.length === 0) return [];

  const outfitIds = links.map(
    (l: { outfit_id: string }) => l.outfit_id,
  );
  const { data, error } = await supabase
    .from("outfits")
    .select("*, outfit_items(item_id, position)")
    .in("id", outfitIds);
  if (error) throw error;

  return (data ?? []).map(
    (row: OutfitRow & { outfit_items: OutfitItemRow[] }) => {
      const itemIds = (row.outfit_items ?? [])
        .sort((a, b) => a.position - b.position)
        .map((oi) => oi.item_id);
      return toOutfit(row, itemIds);
    },
  );
}

export async function saveOutfit(outfit: {
  name: string;
  description: string;
  occasion: string;
  itemIds: string[];
  source?: string;
}): Promise<Outfit> {
  assertNotDemo();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: row, error } = await supabase
    .from("outfits")
    .insert({
      user_id: user.id,
      name: outfit.name,
      description: outfit.description,
      occasion: outfit.occasion,
      source: outfit.source ?? "manual",
      is_saved: true,
    })
    .select()
    .single();
  if (error) throw error;

  if (outfit.itemIds.length > 0) {
    const junctionRows = outfit.itemIds.map((itemId, i) => ({
      outfit_id: row.id,
      item_id: itemId,
      position: i,
    }));
    const { error: jErr } = await supabase
      .from("outfit_items")
      .insert(junctionRows);
    if (jErr) throw jErr;
  }

  return toOutfit(row as OutfitRow, outfit.itemIds);
}
