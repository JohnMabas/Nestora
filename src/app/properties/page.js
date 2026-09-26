import { Suspense } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { getProperties } from "@/lib/data/index";

export const metadata = {
  title: "Properties — Browse Real Estate Listings",
  description:
    "Explore premium properties for sale, rent, and short-let across Lagos, Abuja, and beyond.",
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

  const properties = getProperties(filters);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Container>
        {/* Page header */}
        <div className="mb-10">
          <SectionHeading
            eyebrow="Real Estate"
            title="Browse Properties"
            subtitle="Find your perfect home or investment from our curated selection of premium listings."
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <PropertyFilters initialFilters={filters} />
          </aside>

          {/* Listing grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {properties.length}
                </span>{" "}
                {properties.length === 1 ? "property" : "properties"} found
              </p>
            </div>

            {properties.length > 0 ? (
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                aria-label="Property listings"
              >
                {properties.map((property) => (
                  <li key={property.id}>
                    <PropertyCard property={property} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-3)]"
        aria-hidden="true"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-text-muted)]"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
        No properties found
      </h2>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Try adjusting your filters to see more results.
      </p>
    </div>
  );
}
