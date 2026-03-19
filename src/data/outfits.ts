export interface Outfit {
  id: string;
  name: string;
  description: string;
  occasion: string;
  itemIds: string[];
  date: string;
}

export const outfitOfTheDay: Outfit = {
  id: "ootd-1",
  name: "Casual Friday",
  description:
    "A relaxed yet polished look — the linen blouse keeps it light, and the denim jacket adds a casual layer. Finished with clean white sneakers for effortless weekend energy.",
  occasion: "Weekend",
  itemIds: ["1", "2", "5", "7"],
  date: "2026-03-19",
};

export const outfits: Outfit[] = [
  {
    id: "outfit-1",
    name: "Casual Friday",
    description:
      "A relaxed yet polished look — the linen blouse keeps it light, and the denim jacket adds a casual layer. Finished with clean white sneakers for effortless weekend energy.",
    occasion: "Weekend",
    itemIds: ["1", "2", "5", "7"],
    date: "2026-03-18",
  },
  {
    id: "outfit-2",
    name: "Date Night at the Italian Place",
    description:
      "The little black dress paired with strappy heels and gold hoops — classic, confident, and effortlessly elegant for a candlelit dinner.",
    occasion: "Date Night",
    itemIds: ["17", "15", "14"],
    date: "2026-03-15",
  },
  {
    id: "outfit-3",
    name: "Monday Morning Meeting",
    description:
      "The navy blazer over a ribbed tank tucked into pleated trousers. A structured look that means business without feeling stuffy.",
    occasion: "Work",
    itemIds: ["12", "11", "19", "10"],
    date: "2026-03-12",
  },
  {
    id: "outfit-4",
    name: "Farmers Market Stroll",
    description:
      "The floral wrap dress with white sneakers and a woven crossbody — feminine and easy, perfect for a sunny Saturday morning.",
    occasion: "Casual",
    itemIds: ["8", "5", "22", "18"],
    date: "2026-03-10",
  },
];

export function getOutfitsForItem(itemId: string): Outfit[] {
  return outfits.filter((outfit) => outfit.itemIds.includes(itemId));
}
