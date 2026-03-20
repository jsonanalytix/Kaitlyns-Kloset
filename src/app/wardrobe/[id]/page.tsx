import { clothingItems } from "@/data/wardrobe";
import ItemDetailClient from "./item-detail-client";

export function generateStaticParams() {
  return clothingItems.map((item) => ({ id: item.id }));
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ItemDetailClient id={id} />;
}
