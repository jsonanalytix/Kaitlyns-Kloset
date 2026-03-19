export interface Outfit {
  id: string;
  name: string;
  description: string;
  itemIds: string[];
}

export const outfitOfTheDay: Outfit = {
  id: "ootd-1",
  name: "Casual Friday",
  description:
    "A relaxed yet polished look — the linen blouse keeps it light, and the denim jacket adds a casual layer. Finished with clean white sneakers for effortless weekend energy.",
  itemIds: ["1", "2", "5", "7"],
};
