import ItemDetailClient from "./item-detail-client";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ id: "__placeholder__" }];
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ItemDetailClient id={id} />;
}
