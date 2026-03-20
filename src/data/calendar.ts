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

// --- Wear count per wardrobe item (keyed by item ID) ---

export const wearCounts: Record<string, number> = {
  "1": 7,
  "2": 12,
  "3": 4,
  "4": 7,
  "5": 14,
  "6": 4,
  "7": 9,
  "8": 3,
  "9": 2,
  "10": 8,
  "11": 8,
  "12": 6,
  "13": 5,
  "14": 10,
  "15": 2,
  "16": 2,
  "17": 3,
  "18": 1,
  "19": 7,
  "20": 6,
  "21": 1,
  "22": 5,
  "23": 0,
  "24": 5,
  "25": 1,
};

// --- Calendar entries: 28 entries across February–March 2026 ---

export const calendarEntries: CalendarEntry[] = [
  // ── February 2026 (12 entries) ──
  {
    id: "cal-feb-02",
    date: "2026-02-02",
    outfitName: "Monday Power Move",
    itemIds: ["12", "11", "19", "10"],
    occasion: "Work",
    weatherTemp: 52,
    weatherCondition: "Cloudy",
    weatherDescription: "Layer up — overcast and cool",
  },
  {
    id: "cal-feb-04",
    date: "2026-02-04",
    outfitName: "Rainy Day Polish",
    itemIds: ["1", "19", "10", "24"],
    occasion: "Work",
    mood: "Determined",
    weatherTemp: 48,
    weatherCondition: "Rainy",
    weatherDescription: "Grab an umbrella — steady drizzle",
  },
  {
    id: "cal-feb-05",
    date: "2026-02-05",
    outfitName: "Warm & Grounded",
    itemIds: ["4", "2", "5"],
    occasion: "Casual",
    weatherTemp: 45,
    weatherCondition: "Cloudy",
    weatherDescription: "Cool and gray — sweater weather",
  },
  {
    id: "cal-feb-07",
    date: "2026-02-07",
    outfitName: "Saturday Night Out",
    itemIds: ["21", "15", "14"],
    occasion: "Date Night",
    mood: "Felt glamorous",
    weatherTemp: 50,
    weatherCondition: "Clear",
    weatherDescription: "Cool and clear — bring a wrap",
  },
  {
    id: "cal-feb-10",
    date: "2026-02-10",
    outfitName: "Cozy Commute",
    itemIds: ["4", "19", "10", "24"],
    occasion: "Work",
    weatherTemp: 42,
    weatherCondition: "Cloudy",
    weatherDescription: "Bundle up — chilly morning ahead",
  },
  {
    id: "cal-feb-11",
    date: "2026-02-11",
    outfitName: "Unexpected Sunshine",
    itemIds: ["20", "2", "7", "5"],
    occasion: "Casual",
    mood: "Energized",
    weatherTemp: 55,
    weatherCondition: "Sunny",
    weatherDescription: "Surprise warm spell — enjoy it",
  },
  {
    id: "cal-feb-13",
    date: "2026-02-13",
    outfitName: "Friday Layers",
    itemIds: ["1", "2", "7", "22"],
    occasion: "Casual",
    weatherTemp: 47,
    weatherCondition: "Rainy",
    weatherDescription: "Light rain expected — layer smart",
  },
  {
    id: "cal-feb-16",
    date: "2026-02-16",
    outfitName: "Silk & Structure",
    itemIds: ["6", "12", "19", "10"],
    occasion: "Work",
    weatherTemp: 50,
    weatherCondition: "Cloudy",
    weatherDescription: "Overcast but mild",
  },
  {
    id: "cal-feb-18",
    date: "2026-02-18",
    outfitName: "Midweek Easy",
    itemIds: ["11", "13", "5", "7"],
    occasion: "Casual",
    weatherTemp: 58,
    weatherCondition: "Sunny",
    weatherDescription: "Warm for February — light layers only",
  },
  {
    id: "cal-feb-20",
    date: "2026-02-20",
    outfitName: "Trench Weather",
    itemIds: ["9", "1", "3", "10"],
    occasion: "Work",
    mood: "Put-together",
    weatherTemp: 44,
    weatherCondition: "Rainy",
    weatherDescription: "Steady rain — trench coat day",
  },
  {
    id: "cal-feb-24",
    date: "2026-02-24",
    outfitName: "Errand Run Comfort",
    itemIds: ["4", "2", "5", "22"],
    occasion: "Casual",
    weatherTemp: 52,
    weatherCondition: "Cloudy",
    weatherDescription: "Cool and breezy",
  },
  {
    id: "cal-feb-26",
    date: "2026-02-26",
    outfitName: "Gallery Opening",
    itemIds: ["17", "15", "14", "24"],
    occasion: "Special Event",
    mood: "Felt confident",
    weatherTemp: 55,
    weatherCondition: "Clear",
    weatherDescription: "Crisp evening — elegant weather",
  },

  // ── March 2026 (16 entries, streak of 5 ends today Mar 19) ──
  {
    id: "cal-mar-02",
    date: "2026-03-02",
    outfitName: "Fresh Start Monday",
    itemIds: ["12", "11", "19", "10"],
    occasion: "Work",
    weatherTemp: 58,
    weatherCondition: "Cloudy",
    weatherDescription: "Mild start to the week",
  },
  {
    id: "cal-mar-03",
    date: "2026-03-03",
    outfitName: "Classic Commuter",
    itemIds: ["1", "19", "24", "10"],
    occasion: "Work",
    weatherTemp: 55,
    weatherCondition: "Partly Cloudy",
    weatherDescription: "Sun peeking through — pleasant",
  },
  {
    id: "cal-mar-04",
    date: "2026-03-04",
    outfitName: "Cozy Cardigan Day",
    itemIds: ["16", "11", "2", "5"],
    occasion: "Casual",
    weatherTemp: 50,
    weatherCondition: "Cloudy",
    weatherDescription: "Cool and overcast — grab a layer",
  },
  {
    id: "cal-mar-05",
    date: "2026-03-05",
    outfitName: "Spring Preview",
    itemIds: ["20", "13", "5", "22"],
    occasion: "Casual",
    mood: "Adventurous",
    weatherTemp: 62,
    weatherCondition: "Sunny",
    weatherDescription: "Warm and bright — feels like spring",
  },
  {
    id: "cal-mar-06",
    date: "2026-03-06",
    outfitName: "Casual Friday Ease",
    itemIds: ["4", "2", "7", "5"],
    occasion: "Casual",
    weatherTemp: 54,
    weatherCondition: "Cloudy",
    weatherDescription: "Cool but comfortable",
  },
  {
    id: "cal-mar-08",
    date: "2026-03-08",
    outfitName: "Sunday Brunch Bloom",
    itemIds: ["8", "15", "14"],
    occasion: "Special Event",
    mood: "Festive",
    weatherTemp: 65,
    weatherCondition: "Sunny",
    weatherDescription: "Beautiful day — dress up and enjoy",
  },
  {
    id: "cal-mar-09",
    date: "2026-03-09",
    outfitName: "Boardroom Ready",
    itemIds: ["6", "12", "3", "10"],
    occasion: "Work",
    weatherTemp: 58,
    weatherCondition: "Partly Cloudy",
    weatherDescription: "Comfortable — light blazer is perfect",
  },
  {
    id: "cal-mar-10",
    date: "2026-03-10",
    outfitName: "Market Morning",
    itemIds: ["8", "5", "22", "18"],
    occasion: "Casual",
    mood: "Relaxed",
    weatherTemp: 68,
    weatherCondition: "Sunny",
    weatherDescription: "Gorgeous day — sun hat territory",
  },
  {
    id: "cal-mar-11",
    date: "2026-03-11",
    outfitName: "Midweek Reset",
    itemIds: ["4", "13", "10", "22"],
    occasion: "Casual",
    weatherTemp: 56,
    weatherCondition: "Rainy",
    weatherDescription: "Drizzly — stick with dark layers",
  },
  {
    id: "cal-mar-12",
    date: "2026-03-12",
    outfitName: "Presentation Day",
    itemIds: ["12", "11", "19", "10"],
    occasion: "Work",
    mood: "Focused",
    weatherTemp: 60,
    weatherCondition: "Cloudy",
    weatherDescription: "Overcast but mild",
  },
  {
    id: "cal-mar-13",
    date: "2026-03-13",
    outfitName: "TGIF Casual",
    itemIds: ["11", "2", "7", "5"],
    occasion: "Casual",
    weatherTemp: 63,
    weatherCondition: "Sunny",
    weatherDescription: "Sunny Friday — light and easy",
  },
  // ── Streak begins: 5 consecutive days, Mar 15–19 ──
  {
    id: "cal-mar-15",
    date: "2026-03-15",
    outfitName: "Candlelit Dinner",
    itemIds: ["17", "15", "14"],
    occasion: "Date Night",
    mood: "Felt stunning",
    weatherTemp: 58,
    weatherCondition: "Clear",
    weatherDescription: "Cool clear evening — classic LBD weather",
  },
  {
    id: "cal-mar-16",
    date: "2026-03-16",
    outfitName: "Clean Lines Monday",
    itemIds: ["12", "1", "19", "10"],
    occasion: "Work",
    weatherTemp: 62,
    weatherCondition: "Partly Cloudy",
    weatherDescription: "Comfortable day ahead",
  },
  {
    id: "cal-mar-17",
    date: "2026-03-17",
    outfitName: "Olive & Easy",
    itemIds: ["20", "13", "5", "22"],
    occasion: "Casual",
    mood: "Laid-back",
    weatherTemp: 66,
    weatherCondition: "Sunny",
    weatherDescription: "Warm and bright — spring is here",
  },
  {
    id: "cal-mar-18",
    date: "2026-03-18",
    outfitName: "Breezy Wednesday",
    itemIds: ["1", "2", "5", "7"],
    occasion: "Casual",
    weatherTemp: 70,
    weatherCondition: "Sunny",
    weatherDescription: "Perfect for lightweight layers",
  },
  {
    id: "cal-mar-19",
    date: "2026-03-19",
    outfitName: "Thursday Structure",
    itemIds: ["6", "3", "10", "14"],
    occasion: "Work",
    weatherTemp: 68,
    weatherCondition: "Partly Cloudy",
    weatherDescription: "Mild with a light breeze",
  },
];

// --- 4 daily suggestions for the shuffle feature ---

export const dailySuggestions: DailySuggestion[] = [
  {
    id: "sug-1",
    outfitName: "Breezy Thursday",
    itemIds: ["1", "2", "5", "22"],
    stylingNote:
      "A relaxed linen top with high-waisted jeans — casual and weather-perfect. The crossbody bag keeps your hands free.",
    weatherTemp: 68,
    weatherCondition: "Partly Cloudy",
    weatherDescription: "Perfect for lightweight layers",
  },
  {
    id: "sug-2",
    outfitName: "Polished & Relaxed",
    itemIds: ["6", "3", "10", "14"],
    stylingNote:
      "The silk camisole tucked into a sage midi skirt pairs beautifully with ankle boots. Gold hoops pull it all together.",
    weatherTemp: 68,
    weatherCondition: "Partly Cloudy",
    weatherDescription: "Mild with a light breeze",
  },
  {
    id: "sug-3",
    outfitName: "On-the-Go Energy",
    itemIds: ["11", "13", "5", "7"],
    stylingNote:
      "A ribbed tank under a denim jacket with cargo pants and sneakers — sporty, practical, and effortlessly cool.",
    weatherTemp: 68,
    weatherCondition: "Partly Cloudy",
    weatherDescription: "Great day to be out and about",
  },
  {
    id: "sug-4",
    outfitName: "Evening Ready",
    itemIds: ["17", "15", "14", "24"],
    stylingNote:
      "The little black dress with strappy heels and gold hoops — timeless confidence for any evening plan.",
    weatherTemp: 68,
    weatherCondition: "Partly Cloudy",
    weatherDescription: "Cool enough for a night out",
  },
];

// --- Current month stats (March 2026, through today Mar 19) ---

export const currentMonthStats: MonthlyStats = {
  daysLogged: 16,
  totalWeekdays: 14,
  uniqueItemsWorn: 21,
  mostWornItem: { itemId: "5", wearCount: 7 },
  currentStreak: 5,
  outfitCombinations: 16,
  wardrobeUtilization: 84,
};

// --- Previous month stats (February 2026) ---

export const previousMonthStats: MonthlyStats = {
  daysLogged: 12,
  totalWeekdays: 20,
  uniqueItemsWorn: 20,
  mostWornItem: { itemId: "10", wearCount: 5 },
  currentStreak: 2,
  outfitCombinations: 12,
  wardrobeUtilization: 72,
};

// --- Helpers ---

export function getEntryForDate(date: string): CalendarEntry | undefined {
  return calendarEntries.find((entry) => entry.date === date);
}

export function getEntriesForMonth(year: number, month: number): CalendarEntry[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return calendarEntries.filter((entry) => entry.date.startsWith(prefix));
}

export function getWearCount(itemId: string): number {
  return wearCounts[itemId] ?? 0;
}

export function getMostWornItems(limit = 5): { itemId: string; count: number }[] {
  return Object.entries(wearCounts)
    .map(([itemId, count]) => ({ itemId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getLeastWornItems(limit = 5): { itemId: string; count: number }[] {
  return Object.entries(wearCounts)
    .map(([itemId, count]) => ({ itemId, count }))
    .sort((a, b) => a.count - b.count)
    .slice(0, limit);
}

export function getTodaySuggestion(): DailySuggestion {
  return dailySuggestions[0];
}
