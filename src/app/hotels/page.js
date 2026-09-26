import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import HotelCard from "@/components/hotels/HotelCard";
import HotelFilters from "@/components/hotels/HotelFilters";
import { getHotels } from "@/lib/data/index";

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

  const hotels = getHotels(filters);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Container>
        {/* Page header */}
        <div className="mb-10">
          <SectionHeading
            eyebrow="Accommodations"
            title="Browse Hotels"
            subtitle="Discover world-class hotels and boutique stays across Nigeria's finest destinations."
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <HotelFilters initialFilters={filters} />
          </aside>

          {/* Listing grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {hotels.length}
                </span>{" "}
                {hotels.length === 1 ? "hotel" : "hotels"} found
              </p>
            </div>

            {hotels.length > 0 ? (
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                aria-label="Hotel listings"
              >
                {hotels.map((hotel) => (
                  <li key={hotel.id}>
                    <HotelCard hotel={hotel} />
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
          <path d="M3 22V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14" />
          <path d="M2 22h20" />
          <path d="M9 22v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <rect x="9" y="9" width="2" height="2" />
          <rect x="13" y="9" width="2" height="2" />
          <rect x="9" y="13" width="2" height="2" />
          <rect x="13" y="13" width="2" height="2" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">No hotels found</h2>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Try adjusting your filters to see more results.
      </p>
    </div>
  );
}
