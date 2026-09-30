"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import MobileFilterDrawer from "@/components/shared/MobileFilterDrawer";
import { getProperties } from "@/lib/data/index";

const ITEMS_PER_PAGE = 9;

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "beds-desc",  label: "Most Bedrooms" },
  { value: "area-desc",  label: "Largest Area" },
];

function sortProperties(properties, sort) {
  const arr = [...properties];
  switch (sort) {
    case "price-asc":  return arr.sort((a, b) => a.price - b.price);
    case "price-desc": return arr.sort((a, b) => b.price - a.price);
    case "beds-desc":  return arr.sort((a, b) => b.bedrooms - a.bedrooms);
    case "area-desc":  return arr.sort((a, b) => b.area - a.area);
    case "newest":
    default:
      return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export default function PropertiesClientPage({ initialFilters }) {
  const router    = useRouter();
  const pathname  = usePathname();
  const searchParams = useSearchParams();

  const [sort,           setSort]           = useState(searchParams.get("sort") || "newest");
  const [page,           setPage]           = useState(1);
  const [drawerOpen,     setDrawerOpen]     = useState(false);

  const allProperties  = getProperties(initialFilters);
  const sortedProperties = useMemo(() => sortProperties(allProperties, sort), [allProperties, sort]);
  const totalCount     = sortedProperties.length;
  const paginated      = sortedProperties.slice(0, page * ITEMS_PER_PAGE);
  const hasMore        = paginated.length < totalCount;

  function handleSortChange(newSort) {
    setSort(newSort);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleLoadMore() {
    setPage((p) => p + 1);
  }

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label || "Newest First";

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
          {/* ── Sidebar filters (desktop) ──────────────── */}
          <aside className="hidden lg:block w-72 shrink-0">
            <PropertyFilters initialFilters={initialFilters} />
          </aside>

          {/* ── Listing panel ─────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar row */}
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <p className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[var(--color-text-primary)]">{totalCount}</span>{" "}
                {totalCount === 1 ? "property" : "properties"} found
              </p>

              <div className="flex items-center gap-3">
                {/* Mobile: filter toggle */}
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

                {/* Sort dropdown */}
                <div className="relative flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-xs text-[var(--color-text-muted)] hidden sm:inline whitespace-nowrap">
                    Sort by
                  </label>
                  <select
                    id="sort-select"
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="input-base py-2 text-sm pr-8 min-w-[160px]"
                    aria-label="Sort properties"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Property grid */}
            {totalCount > 0 ? (
              <>
                <ul
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  aria-label="Property listings"
                >
                  {paginated.map((property) => (
                    <li key={property.id}>
                      <PropertyCard property={property} />
                    </li>
                  ))}
                </ul>

                {/* Load more */}
                {hasMore && (
                  <div className="mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="flex items-center gap-2 h-12 px-8 rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface-3)] text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-brand)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      Load more
                      <span className="text-[var(--color-text-muted)]">
                        ({totalCount - paginated.length} remaining)
                      </span>
                    </button>
                  </div>
                )}

                {/* End of results */}
                {!hasMore && totalCount > ITEMS_PER_PAGE && (
                  <p className="mt-10 text-center text-sm text-[var(--color-text-muted)]">
                    All {totalCount} properties loaded
                  </p>
                )}
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </Container>

      {/* ── Mobile filter drawer ─────────────────────── */}
      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filter Properties"
      >
        <PropertyFilters
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
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">No properties found</h2>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Try adjusting your filters to see more results.
      </p>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function FilterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
