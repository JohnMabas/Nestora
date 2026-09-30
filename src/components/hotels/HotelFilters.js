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
export default function HotelFilters({ initialFilters, onApply, inDrawer = false }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [destination, setDestination] = useState(initialFilters.destination || "");
  const [minRating,   setMinRating]   = useState(initialFilters.minRating ?? "");
  const [maxPrice,    setMaxPrice]    = useState(initialFilters.maxPrice   ?? "");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (destination)      params.set("destination", destination);
    if (minRating !== "") params.set("minRating",   String(minRating));
    if (maxPrice  !== "") params.set("maxPrice",    String(maxPrice));
    router.push(`${pathname}?${params.toString()}`);
    onApply?.();
  }, [destination, minRating, maxPrice, pathname, router, onApply]);

  const clearFilters = () => {
    setDestination("");
    setMinRating("");
    setMaxPrice("");
    router.push(pathname);
    onApply?.();
  };

  const hasFilters = destination || minRating !== "" || maxPrice !== "";

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

        {/* Destination */}
        <div>
          <label htmlFor="hf-dest" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Destination
          </label>
          <input
            id="hf-dest"
            type="text"
            placeholder="City or state"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="input-base"
          />
        </div>

        {/* Star rating */}
        <div>
          <label htmlFor="hf-rating" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Min Star Rating
          </label>
          <select
            id="hf-rating"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="input-base"
          >
            <option value="">Any rating</option>
            <option value="3">3★ and above</option>
            <option value="4">4★ and above</option>
            <option value="5">5★ only</option>
          </select>
        </div>

        {/* Max price per night */}
        <div>
          <label htmlFor="hf-price" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Max Price / Night (₦)
          </label>
          <input
            id="hf-price"
            type="number"
            placeholder="e.g. 150000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input-base"
            min="0"
          />
        </div>

        {/* Amenity checkboxes */}
        <div>
          <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">Amenities</p>
          <div className="flex flex-col gap-2">
            {["Free Wi-Fi", "Swimming Pool", "Free Parking", "Gym / Fitness", "Restaurant", "Breakfast Included"].map((amenity) => (
              <label key={amenity} className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)] cursor-pointer group">
                <span className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-surface-3)] group-hover:border-[var(--color-brand)] transition-colors">
                  <input
                    type="checkbox"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    aria-label={amenity}
                  />
                </span>
                {amenity}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-muted)] italic">Amenity filter ready for API integration</p>
        </div>

        <Button onClick={applyFilters} variant="primary" className="w-full justify-center">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
