import { clothingItems, type ClothingItem } from "./wardrobe";

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

export const savedOutfits: StylistOutfit[] = [
  {
    id: "saved-1",
    name: "Effortless Brunch Look",
    occasion: "Casual",
    itemIds: ["1", "3", "5", "22"],
    explanation:
      "A relaxed linen top paired with the sage midi skirt and white sneakers — easy and put-together. The woven crossbody bag ties the earthy tones together perfectly.",
    savedDate: "2026-03-18",
  },
  {
    id: "saved-2",
    name: "Power Meeting",
    occasion: "Work",
    itemIds: ["12", "11", "19", "10"],
    explanation:
      "The navy blazer instantly elevates the ribbed tank. Paired with pleated trousers and ankle boots, this look commands attention while staying comfortable for a long day.",
    savedDate: "2026-03-16",
  },
  {
    id: "saved-3",
    name: "Sunset Date Night",
    occasion: "Date Night",
    itemIds: ["17", "15", "14"],
    explanation:
      "The little black dress is a timeless choice. Add strappy block heels for height and gold hoops for a warm, elegant touch. Understated glamour at its best.",
    savedDate: "2026-03-14",
  },
  {
    id: "saved-4",
    name: "Cozy Coffee Run",
    occasion: "Casual",
    itemIds: ["4", "2", "5", "16"],
    explanation:
      "The cashmere sweater layered under the oversized cardigan makes this the ultimate cozy outfit. Black jeans ground the warm tones, and white sneakers keep it easygoing.",
    savedDate: "2026-03-12",
  },
  {
    id: "saved-5",
    name: "City Explorer",
    occasion: "Travel",
    itemIds: ["20", "13", "5", "7", "22"],
    explanation:
      "The striped tee and cargo pants are a classic adventure combo. The denim jacket handles temperature swings, and the crossbody bag keeps your hands free for exploring.",
    savedDate: "2026-03-10",
  },
  {
    id: "saved-6",
    name: "Evening Elegance",
    occasion: "Date Night",
    itemIds: ["21", "15", "14", "24"],
    explanation:
      "The satin slip dress drapes beautifully and catches the light. A cognac belt cinches the waist, while gold hoops and nude heels complete this sophisticated evening look.",
    savedDate: "2026-03-08",
  },
  {
    id: "saved-7",
    name: "Weekend Farmers Market",
    occasion: "Casual",
    itemIds: ["8", "5", "22", "18"],
    explanation:
      "The floral wrap dress is the star here — feminine and effortless. White sneakers keep it comfortable for walking, the straw hat adds charm, and the crossbody bag is perfect for carrying your finds.",
    savedDate: "2026-03-05",
  },
];

export const chatOutfits: Record<string, StylistOutfit> = {
  "chat-outfit-1": {
    id: "chat-outfit-1",
    name: "Candlelit Dinner",
    occasion: "Date Night",
    itemIds: ["17", "15", "14"],
    explanation:
      "The little black dress is a timeless choice for Italian dining. Strappy block heels add just enough height, and gold hoops bring a warm, elegant touch. Classy without overdoing it.",
    savedDate: "2026-03-19",
  },
  "chat-outfit-2": {
    id: "chat-outfit-2",
    name: "Candlelit Dinner (Walkable Edit)",
    occasion: "Date Night",
    itemIds: ["17", "5", "14", "22"],
    explanation:
      "Same gorgeous LBD, but now with your white leather sneakers for a chic, walkable look. The gold hoops still bring the elegance, and I added the woven crossbody bag so you have your hands free on the stroll there.",
    savedDate: "2026-03-19",
  },
};

export const initialChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "user",
    type: "text",
    content:
      "I have a dinner date tonight at a nice Italian restaurant. Something classy but not overdressed.",
  },
  {
    id: "msg-2",
    sender: "ai",
    type: "text",
    content:
      "Great taste! A nice Italian dinner calls for something elegant yet relaxed — you want to look effortlessly put-together, not like you\u2019re trying too hard. Let me pull together something from your wardrobe.",
  },
  {
    id: "msg-3",
    sender: "ai",
    type: "outfit",
    content: "",
    outfitId: "chat-outfit-1",
  },
  {
    id: "msg-4",
    sender: "user",
    type: "text",
    content:
      "Love it, but can you swap the heels for flats? I\u2019ll be walking to the restaurant.",
  },
  {
    id: "msg-5",
    sender: "ai",
    type: "text",
    content:
      "Of course! Walking in heels is no fun. Let me switch those out for something comfortable while keeping the same vibe.",
  },
  {
    id: "msg-6",
    sender: "ai",
    type: "outfit",
    content: "",
    outfitId: "chat-outfit-2",
  },
];

export const quickChips = [
  { label: "Date night", message: "I need an outfit for date night" },
  { label: "Work", message: "I need something professional for the office" },
  { label: "Casual", message: "Put together a casual everyday look for me" },
  {
    label: "Going out",
    message: "I\u2019m going out with friends tonight \u2014 something fun and stylish",
  },
  {
    label: "Travel day",
    message: "I need a comfortable but cute travel outfit",
  },
];

export function getItemsForOutfit(itemIds: string[]): ClothingItem[] {
  return itemIds
    .map((id) => clothingItems.find((item) => item.id === id))
    .filter((item): item is ClothingItem => item !== undefined);
}
