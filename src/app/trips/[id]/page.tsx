import TripDetailClient from "./trip-detail-client";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ id: "__placeholder__" }];
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TripDetailClient id={id} />;
}
