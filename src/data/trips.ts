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
  luggageType: "backpack" | "carry-on" | "carry-on-checked" | "no-restrictions";
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
  { id: "carry-on-checked", label: "Carry-on + Checked", icon: "luggage-plus" },
  { id: "no-restrictions", label: "No Restrictions", icon: "infinity" },
] as const;

export const trips: Trip[] = [
  {
    id: "trip-1",
    name: "Weekend in Austin",
    destination: "Austin, TX",
    coverImage: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=600&h=400&fit=crop",
    startDate: "2026-04-04",
    endDate: "2026-04-06",
    weatherSummary: "72–85°F, mostly sunny",
    weatherHigh: 85,
    weatherLow: 72,
    luggageType: "carry-on",
    luggageLabel: "Carry-on",
    activities: ["Sightseeing", "Dining out", "Nightlife"],
    days: [
      {
        day: 1,
        label: "Arrival & Dinner",
        activity: "Dining out",
        outfitName: "Effortless Evening",
        outfitItemIds: ["6", "3", "15", "14"],
      },
      {
        day: 2,
        label: "Exploring South Congress",
        activity: "Sightseeing",
        outfitName: "City Explorer",
        outfitItemIds: ["20", "25", "5", "22"],
      },
      {
        day: 3,
        label: "Brunch & Departure",
        activity: "Dining out",
        outfitName: "Casual Brunch",
        outfitItemIds: ["1", "2", "5"],
      },
    ],
    packingList: [
      { itemId: "6", category: "Tops", packed: true },
      { itemId: "20", category: "Tops", packed: true },
      { itemId: "1", category: "Tops", packed: false },
      { itemId: "3", category: "Bottoms", packed: true },
      { itemId: "25", category: "Bottoms", packed: false },
      { itemId: "2", category: "Bottoms", packed: true },
      { itemId: "15", category: "Shoes", packed: true },
      { itemId: "5", category: "Shoes", packed: false },
      { itemId: "14", category: "Accessories", packed: true },
      { itemId: "22", category: "Accessories", packed: false },
    ],
    totalOutfits: 3,
    totalItems: 10,
  },
  {
    id: "trip-2",
    name: "Thailand Backpacking",
    destination: "Bangkok & Chiang Mai",
    coverImage: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop",
    startDate: "2026-05-10",
    endDate: "2026-05-20",
    weatherSummary: "82–95°F, humid with rain",
    weatherHigh: 95,
    weatherLow: 82,
    luggageType: "backpack",
    luggageLabel: "Backpack",
    activities: ["Sightseeing", "Beach", "Hiking", "Dining out", "Nightlife"],
    days: [
      {
        day: 1,
        label: "Arrival in Bangkok",
        activity: "Sightseeing",
        outfitName: "Temple Explorer",
        outfitItemIds: ["11", "13", "5"],
      },
      {
        day: 2,
        label: "Grand Palace & Markets",
        activity: "Sightseeing",
        outfitName: "Market Wanderer",
        outfitItemIds: ["20", "25", "5", "18"],
      },
      {
        day: 3,
        label: "Bangkok Street Food Tour",
        activity: "Dining out",
        outfitName: "Casual Foodie",
        outfitItemIds: ["1", "25", "5"],
      },
      {
        day: 4,
        label: "Travel to Chiang Mai",
        activity: "Sightseeing",
        outfitName: "Travel Comfort",
        outfitItemIds: ["11", "2", "5", "22"],
      },
      {
        day: 5,
        label: "Doi Suthep Hike",
        activity: "Hiking",
        outfitName: "Trail Ready",
        outfitItemIds: ["20", "13", "5"],
      },
      {
        day: 6,
        label: "Old City Temples",
        activity: "Sightseeing",
        outfitName: "Temple Day",
        outfitItemIds: ["1", "13", "5", "18"],
      },
      {
        day: 7,
        label: "Cooking Class",
        activity: "Dining out",
        outfitName: "Kitchen Ready",
        outfitItemIds: ["11", "25", "5"],
      },
      {
        day: 8,
        label: "Night Bazaar",
        activity: "Nightlife",
        outfitName: "Bazaar Night",
        outfitItemIds: ["6", "2", "5", "14"],
      },
      {
        day: 9,
        label: "Elephant Sanctuary",
        activity: "Sightseeing",
        outfitName: "Nature Day",
        outfitItemIds: ["20", "13", "5", "22"],
      },
      {
        day: 10,
        label: "Departure Day",
        activity: "Sightseeing",
        outfitName: "Comfy Departure",
        outfitItemIds: ["11", "2", "5"],
      },
    ],
    packingList: [
      { itemId: "11", category: "Tops", packed: true },
      { itemId: "20", category: "Tops", packed: true },
      { itemId: "1", category: "Tops", packed: false },
      { itemId: "6", category: "Tops", packed: false },
      { itemId: "13", category: "Bottoms", packed: true },
      { itemId: "25", category: "Bottoms", packed: true },
      { itemId: "2", category: "Bottoms", packed: false },
      { itemId: "5", category: "Shoes", packed: true },
      { itemId: "18", category: "Accessories", packed: false },
      { itemId: "22", category: "Accessories", packed: false },
      { itemId: "14", category: "Accessories", packed: true },
    ],
    totalOutfits: 10,
    totalItems: 11,
  },
  {
    id: "trip-3",
    name: "NYC Work Trip",
    destination: "New York City",
    coverImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
    startDate: "2026-04-20",
    endDate: "2026-04-23",
    weatherSummary: "55–65°F, partly cloudy",
    weatherHigh: 65,
    weatherLow: 55,
    luggageType: "carry-on-checked",
    luggageLabel: "Carry-on + Checked",
    activities: ["Business meetings", "Dining out", "Sightseeing"],
    days: [
      {
        day: 1,
        label: "Client Meeting",
        activity: "Business meetings",
        outfitName: "Power Meeting",
        outfitItemIds: ["12", "11", "19", "10"],
      },
      {
        day: 2,
        label: "Presentations & Lunch",
        activity: "Business meetings",
        outfitName: "Polished Professional",
        outfitItemIds: ["4", "19", "10", "24"],
      },
      {
        day: 3,
        label: "Free Afternoon & Dinner",
        activity: "Dining out",
        outfitName: "Off-Duty Chic",
        outfitItemIds: ["21", "9", "15", "14"],
      },
      {
        day: 4,
        label: "Morning Walk & Departure",
        activity: "Sightseeing",
        outfitName: "Comfy Travel",
        outfitItemIds: ["4", "2", "5", "22"],
      },
    ],
    packingList: [
      { itemId: "12", category: "Outerwear", packed: true },
      { itemId: "9", category: "Outerwear", packed: true },
      { itemId: "11", category: "Tops", packed: true },
      { itemId: "4", category: "Tops", packed: false },
      { itemId: "21", category: "Dresses", packed: false },
      { itemId: "19", category: "Bottoms", packed: true },
      { itemId: "2", category: "Bottoms", packed: false },
      { itemId: "10", category: "Shoes", packed: true },
      { itemId: "15", category: "Shoes", packed: false },
      { itemId: "5", category: "Shoes", packed: false },
      { itemId: "14", category: "Accessories", packed: true },
      { itemId: "24", category: "Accessories", packed: true },
      { itemId: "22", category: "Accessories", packed: false },
    ],
    totalOutfits: 4,
    totalItems: 13,
  },
];

export const forgottenEssentials = [
  { label: "Underwear", note: "Pack 1 per day + 1 extra", icon: "sparkles" },
  { label: "Pajamas", note: "1–2 sets depending on trip length", icon: "moon" },
  { label: "Toiletries", note: "Toothbrush, skincare, sunscreen", icon: "droplets" },
  { label: "Chargers", note: "Phone, laptop, earbuds", icon: "battery-charging" },
];
