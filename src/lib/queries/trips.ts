import { supabase } from "@/lib/supabase";
import { assertNotDemo } from "@/lib/demo";

export interface TripDay {
  day: number;
  label: string;
  activity: string;
  outfitName: string;
  outfitItemIds: string[];
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  weatherSummary: string;
  weatherHigh: number;
  weatherLow: number;
  luggageType:
    | "backpack"
    | "carry-on"
    | "carry-on-checked"
    | "no-restrictions";
  luggageLabel: string;
  activities: string[];
  days: TripDay[];
  packingList: PackingItem[];
  totalOutfits: number;
  totalItems: number;
}

export interface PackingItem {
  itemId: string;
  category: string;
  packed: boolean;
}

export const activities = [
  "Sightseeing",
  "Beach",
  "Hiking",
  "Dining out",
  "Nightlife",
  "Business meetings",
  "Working out",
];

export const luggageOptions = [
  { id: "backpack", label: "Backpack", icon: "backpack" },
  { id: "carry-on", label: "Carry-on", icon: "luggage" },
  {
    id: "carry-on-checked",
    label: "Carry-on + Checked",
    icon: "luggage-plus",
  },
  { id: "no-restrictions", label: "No Restrictions", icon: "infinity" },
] as const;

export const forgottenEssentials = [
  { label: "Underwear", note: "Pack 1 per day + 1 extra", icon: "sparkles" },
  {
    label: "Pajamas",
    note: "1\u20132 sets depending on trip length",
    icon: "moon",
  },
  {
    label: "Toiletries",
    note: "Toothbrush, skincare, sunscreen",
    icon: "droplets",
  },
  {
    label: "Chargers",
    note: "Phone, laptop, earbuds",
    icon: "battery-charging",
  },
];

const LUGGAGE_LABELS: Record<string, string> = {
  backpack: "Backpack",
  "carry-on": "Carry-on",
  "carry-on-checked": "Carry-on + Checked",
  "no-restrictions": "No Restrictions",
};

interface TripRow {
  id: string;
  user_id: string;
  name: string;
  destination: string;
  cover_image_url: string;
  start_date: string;
  end_date: string;
  weather_summary: string;
  weather_high: number;
  weather_low: number;
  luggage_type: string;
  activities: string[];
  created_at: string;
}

interface TripDayRow {
  id: string;
  trip_id: string;
  day_number: number;
  label: string;
  activity: string;
  outfit_name: string;
  trip_day_items: { item_id: string }[];
}

interface PackingListRow {
  id: string;
  item_id: string;
  category: string;
  packed: boolean;
}

function toTrip(
  row: TripRow,
  days: TripDay[],
  packingList: PackingItem[],
): Trip {
  return {
    id: row.id,
    name: row.name,
    destination: row.destination,
    coverImage: row.cover_image_url ?? "",
    startDate: row.start_date,
    endDate: row.end_date,
    weatherSummary: row.weather_summary ?? "",
    weatherHigh: row.weather_high ?? 0,
    weatherLow: row.weather_low ?? 0,
    luggageType: row.luggage_type as Trip["luggageType"],
    luggageLabel: LUGGAGE_LABELS[row.luggage_type] ?? row.luggage_type,
    activities: row.activities ?? [],
    days,
    packingList,
    totalOutfits: days.length,
    totalItems: packingList.length,
  };
}

const TRIP_SELECT =
  "*, trip_days(id, day_number, label, activity, outfit_name, trip_day_items(item_id)), packing_list_items(id, item_id, category, packed)";

type TripQueryRow = TripRow & {
  trip_days: TripDayRow[];
  packing_list_items: PackingListRow[];
};

function parseTripRow(row: TripQueryRow): Trip {
  const days = (row.trip_days ?? [])
    .sort((a, b) => a.day_number - b.day_number)
    .map((d) => ({
      day: d.day_number,
      label: d.label,
      activity: d.activity,
      outfitName: d.outfit_name,
      outfitItemIds: (d.trip_day_items ?? []).map((tdi) => tdi.item_id),
    }));
  const packingList = (row.packing_list_items ?? []).map((p) => ({
    itemId: p.item_id,
    category: p.category,
    packed: p.packed,
  }));
  return toTrip(row, days, packingList);
}

export async function getTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select(TRIP_SELECT)
    .order("start_date", { ascending: true });
  if (error) throw error;
  return ((data as TripQueryRow[]) ?? []).map(parseTripRow);
}

export async function getTripById(id: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from("trips")
    .select(TRIP_SELECT)
    .eq("id", id)
    .single();
  if (error) return null;
  return data ? parseTripRow(data as TripQueryRow) : null;
}

export async function createTrip(trip: {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  activities: string[];
  luggageType: string;
  weatherSummary?: string;
  weatherHigh?: number;
  weatherLow?: number;
}): Promise<Trip> {
  assertNotDemo();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      name: trip.name,
      destination: trip.destination,
      start_date: trip.startDate,
      end_date: trip.endDate,
      activities: trip.activities,
      luggage_type: trip.luggageType,
      weather_summary: trip.weatherSummary ?? "",
      weather_high: trip.weatherHigh ?? 0,
      weather_low: trip.weatherLow ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return toTrip(data as TripRow, [], []);
}

export async function togglePacked(
  tripId: string,
  itemId: string,
  packed: boolean,
): Promise<void> {
  assertNotDemo();
  const { error } = await supabase
    .from("packing_list_items")
    .update({ packed })
    .eq("trip_id", tripId)
    .eq("item_id", itemId);
  if (error) throw error;
}
