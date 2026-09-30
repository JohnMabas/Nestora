import { Suspense } from "react";
import PropertiesClientPage from "@/components/properties/PropertiesClientPage";

export const metadata = {
  title: "Properties — Browse Real Estate Listings",
  description:
    "Explore premium properties for sale, rent, and short-let across Jos Plateau and Abuja, Nigeria.",
};

export default async function PropertiesPage({ searchParams }) {
  const sp = await searchParams;

  const filters = {
    location:    sp.location    || "",
    type:        sp.type        || "all",
    listingType: sp.listingType || "all",
    minPrice:    sp.minPrice    ? Number(sp.minPrice)  : undefined,
    maxPrice:    sp.maxPrice    ? Number(sp.maxPrice)  : undefined,
    minBeds:     sp.minBeds     ? Number(sp.minBeds)   : undefined,
  };

  return (
    <Suspense>
      <PropertiesClientPage initialFilters={filters} />
    </Suspense>
  );
}
