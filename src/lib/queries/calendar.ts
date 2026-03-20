import { supabase } from "@/lib/supabase";
import { assertNotDemo } from "@/lib/demo";

export interface CalendarEntry {
  id: string;
  date: string;
  outfitName: string;
  itemIds: string[];
  occasion?: string;
  mood?: string;
  photoUrl?: string;
  weatherTemp: number;
  weatherCondition: string;
  weatherDescription: string;
}

export interface DailySuggestion {
  id: string;
  outfitName: string;
  itemIds: string[];
  stylingNote: string;
  weatherTemp: number;
  weatherCondition: string;
  weatherDescription: string;
}

export interface MonthlyStats {
  daysLogged: number;
  totalWeekdays: number;
  uniqueItemsWorn: number;
  mostWornItem: { itemId: string; wearCount: number };
  currentStreak: number;
  outfitCombinations: number;
  wardrobeUtilization: number;
}

interface CalendarEntryRow {
  id: string;
  user_id: string;
  date: string;
  outfit_name: string;
  occasion: string | null;
  mood: string | null;
  photo_url: string | null;
  weather_temp: number;
  weather_condition: string;
  weather_description: string;
  calendar_entry_items: { item_id: string }[];
}

function toCalendarEntry(row: CalendarEntryRow): CalendarEntry {
  return {
    id: row.id,
    date: row.date,
    outfitName: row.outfit_name ?? "",
    itemIds: (row.calendar_entry_items ?? []).map((i) => i.item_id),
    occasion: row.occasion ?? undefined,
    mood: row.mood ?? undefined,
    photoUrl: row.photo_url ?? undefined,
    weatherTemp: row.weather_temp ?? 0,
    weatherCondition: row.weather_condition ?? "",
    weatherDescription: row.weather_description ?? "",
  };
}

export async function getEntriesForMonth(
  year: number,
  month: number,
): Promise<CalendarEntry[]> {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("calendar_entries")
    .select("*, calendar_entry_items(item_id)")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });
  if (error) throw error;
  return ((data as CalendarEntryRow[]) ?? []).map(toCalendarEntry);
}

export async function getEntryForDate(
  date: string,
): Promise<CalendarEntry | null> {
  const { data, error } = await supabase
    .from("calendar_entries")
    .select("*, calendar_entry_items(item_id)")
    .eq("date", date)
    .maybeSingle();
  if (error) throw error;
  return data ? toCalendarEntry(data as CalendarEntryRow) : null;
}

export async function logEntry(entry: {
  date: string;
  outfitName: string;
  itemIds: string[];
  occasion?: string;
  mood?: string;
  photoUrl?: string;
  weatherTemp?: number;
  weatherCondition?: string;
  weatherDescription?: string;
}): Promise<CalendarEntry> {
  assertNotDemo();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("calendar_entries")
    .insert({
      user_id: user.id,
      date: entry.date,
      outfit_name: entry.outfitName,
      occasion: entry.occasion,
      mood: entry.mood,
      photo_url: entry.photoUrl,
      weather_temp: entry.weatherTemp ?? 0,
      weather_condition: entry.weatherCondition ?? "",
      weather_description: entry.weatherDescription ?? "",
    })
    .select()
    .single();
  if (error) throw error;

  if (entry.itemIds.length > 0) {
    const rows = entry.itemIds.map((itemId) => ({
      calendar_entry_id: data.id,
      item_id: itemId,
    }));
    await supabase.from("calendar_entry_items").insert(rows);
  }

  return {
    id: data.id,
    date: data.date,
    outfitName: data.outfit_name,
    itemIds: entry.itemIds,
    occasion: data.occasion ?? undefined,
    mood: data.mood ?? undefined,
    photoUrl: data.photo_url ?? undefined,
    weatherTemp: data.weather_temp,
    weatherCondition: data.weather_condition,
    weatherDescription: data.weather_description,
  };
}

export async function getMonthlyStats(
  year: number,
  month: number,
  totalWardrobeItems: number = 25,
): Promise<MonthlyStats> {
  const entries = await getEntriesForMonth(year, month);

  const allItemIds = entries.flatMap((e) => e.itemIds);
  const uniqueItems = new Set(allItemIds);

  const counts: Record<string, number> = {};
  for (const id of allItemIds) counts[id] = (counts[id] || 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const daysInMonth = new Date(year, month, 0).getDate();
  let totalWeekdays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month - 1, d).getDay();
    if (dow !== 0 && dow !== 6) totalWeekdays++;
  }

  let streak = 0;
  const checkDate = new Date();
  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (entries.some((e) => e.date === dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const utilization =
    totalWardrobeItems > 0
      ? Math.round((uniqueItems.size / totalWardrobeItems) * 100)
      : 0;

  return {
    daysLogged: entries.length,
    totalWeekdays,
    uniqueItemsWorn: uniqueItems.size,
    mostWornItem:
      sorted.length > 0
        ? { itemId: sorted[0][0], wearCount: sorted[0][1] }
        : { itemId: "", wearCount: 0 },
    currentStreak: streak,
    outfitCombinations: entries.length,
    wardrobeUtilization: utilization,
  };
}

export async function getWearCounts(): Promise<Record<string, number>> {
  const { data: entries, error } = await supabase
    .from("calendar_entries")
    .select("calendar_entry_items(item_id)");
  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const entry of entries ?? []) {
    for (const item of (
      entry as { calendar_entry_items: { item_id: string }[] }
    ).calendar_entry_items ?? []) {
      counts[item.item_id] = (counts[item.item_id] || 0) + 1;
    }
  }
  return counts;
}

export async function getWearCount(itemId: string): Promise<number> {
  const { count, error } = await supabase
    .from("calendar_entry_items")
    .select("*", { count: "exact", head: true })
    .eq("item_id", itemId);
  if (error) return 0;
  return count ?? 0;
}

export async function getMostWornItems(
  limit: number = 5,
): Promise<{ itemId: string; count: number }[]> {
  const counts = await getWearCounts();
  return Object.entries(counts)
    .map(([itemId, count]) => ({ itemId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getLeastWornItems(
  limit: number = 5,
): Promise<{ itemId: string; count: number }[]> {
  const { data: allItems, error: itemsErr } = await supabase
    .from("wardrobe_items")
    .select("id");
  if (itemsErr) throw itemsErr;

  const counts = await getWearCounts();
  return (allItems ?? [])
    .map((item: { id: string }) => ({
      itemId: item.id,
      count: counts[item.id] ?? 0,
    }))
    .sort((a, b) => a.count - b.count)
    .slice(0, limit);
}

export async function getDailySuggestions(): Promise<DailySuggestion[]> {
  const { data, error } = await supabase
    .from("outfits")
    .select("*, outfit_items(item_id, position)")
    .eq("source", "ai_stylist")
    .order("created_at", { ascending: false })
    .limit(4);
  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => {
    const items =
      (row.outfit_items as { item_id: string; position: number }[] | null) ??
      [];
    return {
      id: row.id as string,
      outfitName: (row.name as string) ?? "",
      itemIds: items
        .sort((a, b) => a.position - b.position)
        .map((i) => i.item_id),
      stylingNote: (row.description as string) ?? "",
      weatherTemp: 0,
      weatherCondition: "",
      weatherDescription: "",
    };
  });
}
