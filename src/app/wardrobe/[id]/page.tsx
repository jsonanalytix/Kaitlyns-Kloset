import ItemDetailClient from "./item-detail-client";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ id: "__placeholder__" }];
}

export default function ItemDetailPage() {
  return <ItemDetailClient />;
}
