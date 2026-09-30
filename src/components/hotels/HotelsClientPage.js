"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import HotelCard from "@/components/hotels/HotelCard";
import HotelFilters from "@/components/hotels/HotelFilters";
import HotelSearch from "@/components/hotels/HotelSearch";
import MobileFilterDrawer from "@/components/shared/MobileFilterDrawer";
import { getHotels } from "@/lib/data/index";

const ITEMS_PER_PAGE = 9;

const SORT_OPTIONS = [
  { value: "recommended",  label: "Recommended" },
  { value: "price-asc",    label: "Price: Low to High" },
  { value: "price-desc",   label: "Price: High to Low" },
  { value: "rating-desc",  label: "Guest Rating" },
  { value: "stars-desc",   label: "Star Rating" },
];

function sortHotels(hotels, sort) {
  const arr = [...hotels];
  switch (sort) {
    case "price-asc":   return arr.sort((a, b) => a.priceFrom - b.priceFrom);
    case "price-desc":  return arr.sort((a, b) => b.priceFrom - a.priceFrom);
    case "rating-desc": return arr.sort((a, b) => b.guestRating - a.guestRating);
    case "stars-desc":  return arr.sort((a, b) => b.starRating - a.starRating);
    case "recommended":
    default:
      return arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}

export default function HotelsClientPage({ initialFilters }) {
  const router     = useRouter();
  const pathname   = usePathname();
  const searchParams = useSearchParams();

  const [sort,       setSort]       = useState(searchParams.get("sort") || "recommended");
  const [page,       setPage]       = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const allHotels    = getHotels(initialFilters);
  const sortedHotels = useMemo(() => sortHotels(allHotels, sort), [allHotels, sort]);
  const totalCount   = sortedHotels.length;
  const paginated    = sortedHotels.slice(0, page * ITEMS_PER_PAGE);
  const hasMore      = paginated.length < totalCount;

  function handleSortChange(newSort) {
    setSort(newSort);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // Build initial values for the search bar from URL params
  const searchInitial = {
    destination: initialFilters.destination || "",
    checkIn:     searchParams.get("checkIn")  || "",
    checkOut:    searchParams.get("checkOut") || "",
    guests:      Number(searchParams.get("guests")) || 2,
    rooms:       Number(searchParams.get("rooms"))  || 1,
  };

  return (
    <div className="min-h-screen pb-20">
      {/* ── Hero search band ──────────────────────────── */}
      <div className="bg-[var(--color-surface-0)] border-b border-[var(--color-border)] pt-28 pb-8">
        <Container>
          <div className="mb-6">
            <SectionHeading
              eyebrow="Accommodations"
              title="Find Your Perfect Stay"
              subtitle="Discover world-class hotels and boutique stays across Nigeria's finest destinations."
            />
          </div>
          <HotelSearch initialValues={searchInitial} />
        </Container>
      </div>

      {/* ── Main content ──────────────────────────────── */}
      <div className="pt-10">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar filters (desktop) */}
            <aside className="hidden lg:block w-72 shrink-0">
              <HotelFilters initialFilters={initialFilters} />
            </aside>

            {/* Listing panel */}
            <div className="flex-1 min-w-0">
              {/* Toolbar row */}
              <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  <span className="font-semibold text-[var(--color-text-primary)]">{totalCount}</span>{" "}
                  {totalCount === 1 ? "hotel" : "hotels"} found
                </p>

                <div className="flex items-center gap-3">
                  {/* Mobile filter toggle */}
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="lg:hidden flex items-center gap-2 h-9 px-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-3)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand)] hover:text-[var(--color-text-primary)] transition-colors"
                    aria-expanded={drawerOpen}
                    aria-haspopup="dialog"
                  >
                    <FilterIcon />
                    Filters
                  </button>

                  {/* Sort */}
                  <div className="relative flex items-center gap-2">
                    <label htmlFor="hotel-sort" className="text-xs text-[var(--color-text-muted)] hidden sm:inline whitespace-nowrap">
                      Sort by
                    </label>
                    <select
                      id="hotel-sort"
                      value={sort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="input-base py-2 text-sm pr-8 min-w-[180px]"
                      aria-label="Sort hotels"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Hotel grid */}
              {totalCount > 0 ? (
                <>
                  <ul
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    aria-label="Hotel listings"
                  >
                    {paginated.map((hotel) => (
                      <li key={hotel.id}>
                        <HotelCard hotel={hotel} />
                      </li>
                    ))}
                  </ul>

                  {/* Load more */}
                  {hasMore && (
                    <div className="mt-10 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setPage((p) => p + 1)}
                        className="flex items-center gap-2 h-12 px-8 rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface-3)] text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-brand)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        Load more
                        <span className="text-[var(--color-text-muted)]">
                          ({totalCount - paginated.length} remaining)
                        </span>
                      </button>
                    </div>
                  )}

                  {!hasMore && totalCount > ITEMS_PER_PAGE && (
                    <p className="mt-10 text-center text-sm text-[var(--color-text-muted)]">
                      All {totalCount} hotels loaded
                    </p>
                  )}
                </>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filter Hotels"
      >
        <HotelFilters
          initialFilters={initialFilters}
          onApply={() => setDrawerOpen(false)}
          inDrawer
        />
      </MobileFilterDrawer>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

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
        Try adjusting your search or filters to see more results.
      </p>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4"  y1="6"  x2="20" y2="6" />
      <line x1="8"  y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
