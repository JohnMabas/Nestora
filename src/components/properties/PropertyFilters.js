"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";

/**
 * @param {{
 *   initialFilters: object,
 *   onApply?: () => void,
 *   inDrawer?: boolean
 * }} props
 */
export default function PropertyFilters({ initialFilters, onApply, inDrawer = false }) {
  const router     = useRouter();
  const pathname   = usePathname();

  const [location,    setLocation]    = useState(initialFilters.location    || "");
  const [type,        setType]        = useState(initialFilters.type        || "all");
  const [listingType, setListingType] = useState(initialFilters.listingType || "all");
  const [minPrice,    setMinPrice]    = useState(initialFilters.minPrice    ?? "");
  const [maxPrice,    setMaxPrice]    = useState(initialFilters.maxPrice    ?? "");
  const [minBeds,     setMinBeds]     = useState(initialFilters.minBeds     ?? "");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (location)                         params.set("location",    location);
    if (type        && type    !== "all") params.set("type",        type);
    if (listingType && listingType !== "all") params.set("listingType", listingType);
    if (minPrice !== "") params.set("minPrice", String(minPrice));
    if (maxPrice !== "") params.set("maxPrice", String(maxPrice));
    if (minBeds  !== "") params.set("minBeds",  String(minBeds));
    router.push(`${pathname}?${params.toString()}`);
    onApply?.();
  }, [location, type, listingType, minPrice, maxPrice, minBeds, pathname, router, onApply]);

  const clearFilters = () => {
    setLocation("");
    setType("all");
    setListingType("all");
    setMinPrice("");
    setMaxPrice("");
    setMinBeds("");
    router.push(pathname);
    onApply?.();
  };

  const hasFilters =
    location || type !== "all" || listingType !== "all" || minPrice !== "" || maxPrice !== "" || minBeds !== "";

  const wrapperCls = inDrawer
    ? "flex flex-col gap-5"
    : "bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 sticky top-28 flex flex-col gap-5";

  return (
    <div>
      {!inDrawer && (
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-[var(--color-text-primary)]">Filters</h2>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-[var(--color-brand)] hover:underline">
              Clear all
            </button>
          )}
        </div>
      )}

      <div className={wrapperCls}>
        {inDrawer && hasFilters && (
          <button onClick={clearFilters} className="self-start text-xs text-[var(--color-brand)] hover:underline">
            Clear all filters
          </button>
        )}

        {/* Location */}
        <div>
          <label htmlFor="pf-location" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Location
          </label>
          <input
            id="pf-location"
            type="text"
            placeholder="City, state or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-base"
          />
        </div>

        {/* Listing type */}
        <div>
          <label htmlFor="pf-listing" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Listing Type
          </label>
          <select
            id="pf-listing"
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className="input-base"
          >
            <option value="all">All types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="short-let">Short Let</option>
          </select>
        </div>

        {/* Property type */}
        <div>
          <label htmlFor="pf-type" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Property Type
          </label>
          <select
            id="pf-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-base"
          >
            <option value="all">All properties</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="penthouse">Penthouse</option>
            <option value="studio">Studio</option>
            <option value="duplex">Duplex</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Price range */}
        <div>
          <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Price Range (₦)</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="input-base"
              min="0"
              aria-label="Minimum price"
            />
            <span className="text-[var(--color-text-muted)] shrink-0 text-sm">–</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input-base"
              min="0"
              aria-label="Maximum price"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label htmlFor="pf-beds" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Min Bedrooms
          </label>
          <select
            id="pf-beds"
            value={minBeds}
            onChange={(e) => setMinBeds(e.target.value)}
            className="input-base"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <Button onClick={applyFilters} variant="primary" className="w-full justify-center">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
