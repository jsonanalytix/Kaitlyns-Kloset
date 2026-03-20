import { supabase } from "@/lib/supabase";
import { assertNotDemo } from "@/lib/demo";

export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  color: string;
  colorHex: string;
  season: string;
  formality: string;
  fabricWeight: string;
  tags: string[];
  addedDaysAgo: number;
  wearCount: number;
}

export const categories = [
  "All",
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Accessories",
];

export const seasons = ["All-season", "Spring", "Summer", "Fall", "Winter"];

export const formalities = ["Casual", "Smart-casual", "Formal"];

interface WardrobeRow {
  id: string;
  user_id: string;
  name: string;
  category: string;
  image_url: string;
  color: string;
  color_hex: string;
  season: string;
  formality: string;
  fabric_weight: string;
  tags: string[];
  wear_count: number;
  created_at: string;
}

function toClothingItem(row: WardrobeRow): ClothingItem {
  const diffMs = Date.now() - new Date(row.created_at).getTime();
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    imageUrl: row.image_url,
    color: row.color,
    colorHex: row.color_hex,
    season: row.season,
    formality: row.formality,
    fabricWeight: row.fabric_weight,
    tags: row.tags ?? [],
    addedDaysAgo: Math.max(0, Math.floor(diffMs / 86_400_000)),
    wearCount: row.wear_count ?? 0,
  };
}

export async function getWardrobeItems(): Promise<ClothingItem[]> {
  const { data, error } = await supabase
    .from("wardrobe_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data as WardrobeRow[]) ?? []).map(toClothingItem);
}

export async function getItemById(id: string): Promise<ClothingItem | null> {
  const { data, error } = await supabase
    .from("wardrobe_items")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data ? toClothingItem(data as WardrobeRow) : null;
}

export async function getItemsByIds(ids: string[]): Promise<ClothingItem[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("wardrobe_items")
    .select("*")
    .in("id", ids);
  if (error) throw error;
  return ((data as WardrobeRow[]) ?? []).map(toClothingItem);
}

export async function addItem(
  item: Omit<ClothingItem, "id" | "addedDaysAgo" | "wearCount">,
): Promise<ClothingItem> {
  assertNotDemo();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("wardrobe_items")
    .insert({
      user_id: user.id,
      name: item.name,
      category: item.category,
      image_url: item.imageUrl,
      color: item.color,
      color_hex: item.colorHex,
      season: item.season,
      formality: item.formality,
      fabric_weight: item.fabricWeight,
      tags: item.tags,
    })
    .select()
    .single();
  if (error) throw error;
  return toClothingItem(data as WardrobeRow);
}

export async function deleteItem(id: string): Promise<void> {
  assertNotDemo();
  const { error } = await supabase
    .from("wardrobe_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export function computeWardrobeStats(items: ClothingItem[]) {
  const uniqueCategories = new Set(items.map((i) => i.category));
  const dayOfMonth = new Date().getDate();
  const addedThisMonth = items.filter(
    (i) => i.addedDaysAgo < dayOfMonth,
  ).length;
  return {
    totalItems: items.length,
    categories: uniqueCategories.size,
    addedThisMonth,
  };
}
