import { Suspense } from "react";
import HotelsClientPage from "@/components/hotels/HotelsClientPage";

export const metadata = {
  title: "Hotels — Discover Premium Stays",
  description:
    "Browse Nigeria's finest hotels, resorts, and boutique stays. Filter by city, rating, and price.",
};

export default async function HotelsPage({ searchParams }) {
  const sp = await searchParams;

  const filters = {
    destination: sp.destination || "",
    minRating:   sp.minRating ? Number(sp.minRating) : undefined,
    maxPrice:    sp.maxPrice  ? Number(sp.maxPrice)  : undefined,
  };

  return (
    <Suspense>
      <HotelsClientPage initialFilters={filters} />
    </Suspense>
  );
}
