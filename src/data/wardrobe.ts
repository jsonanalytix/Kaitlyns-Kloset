export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  color: string;
  colorHex: string;
  season: string;
  addedDaysAgo: number;
}

export const clothingItems: ClothingItem[] = [
  {
    id: "1",
    name: "Cream Linen Blouse",
    category: "Tops",
    imageUrl: "https://picsum.photos/seed/linen-blouse/400/500",
    color: "Cream",
    colorHex: "#F5F0E6",
    season: "Summer",
    addedDaysAgo: 2,
  },
  {
    id: "2",
    name: "High-Waisted Black Jeans",
    category: "Bottoms",
    imageUrl: "https://picsum.photos/seed/black-jeans/400/500",
    color: "Black",
    colorHex: "#1C1C1C",
    season: "All-season",
    addedDaysAgo: 5,
  },
  {
    id: "3",
    name: "Sage Midi Skirt",
    category: "Bottoms",
    imageUrl: "https://picsum.photos/seed/sage-skirt/400/500",
    color: "Sage",
    colorHex: "#9CAF88",
    season: "Spring",
    addedDaysAgo: 3,
  },
  {
    id: "4",
    name: "Camel Cashmere Sweater",
    category: "Tops",
    imageUrl: "https://picsum.photos/seed/cashmere-sweater/400/500",
    color: "Camel",
    colorHex: "#C4956A",
    season: "Fall",
    addedDaysAgo: 7,
  },
  {
    id: "5",
    name: "White Leather Sneakers",
    category: "Shoes",
    imageUrl: "https://picsum.photos/seed/white-sneakers/400/500",
    color: "White",
    colorHex: "#F8F8F8",
    season: "All-season",
    addedDaysAgo: 1,
  },
  {
    id: "6",
    name: "Blush Silk Camisole",
    category: "Tops",
    imageUrl: "https://picsum.photos/seed/silk-cami/400/500",
    color: "Blush",
    colorHex: "#E8C4C0",
    season: "Summer",
    addedDaysAgo: 4,
  },
  {
    id: "7",
    name: "Classic Denim Jacket",
    category: "Outerwear",
    imageUrl: "https://picsum.photos/seed/denim-jacket/400/500",
    color: "Blue",
    colorHex: "#6B8EAD",
    season: "All-season",
    addedDaysAgo: 10,
  },
  {
    id: "8",
    name: "Floral Wrap Dress",
    category: "Dresses",
    imageUrl: "https://picsum.photos/seed/wrap-dress/400/500",
    color: "Pink",
    colorHex: "#E8A0B4",
    season: "Spring",
    addedDaysAgo: 6,
  },
];

export const categories = [
  "All",
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Accessories",
];

export const wardrobeStats = {
  totalItems: 47,
  categories: 6,
  addedThisMonth: 5,
};
