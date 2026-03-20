import { trips } from "@/data/trips";
import TripDetailClient from "./trip-detail-client";

export function generateStaticParams() {
  return trips.map((trip) => ({ id: trip.id }));
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TripDetailClient id={id} />;
}
