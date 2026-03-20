import TripDetailClient from "./trip-detail-client";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ id: "__placeholder__" }];
}

export default function TripDetailPage() {
  return <TripDetailClient />;
}
