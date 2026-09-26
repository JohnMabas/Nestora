"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";

/**
 * @param {{ initialFilters: object }} props
 */
export default function HotelFilters({ initialFilters }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [destination, setDestination] = useState(initialFilters.destination || "");
  const [minRating,   setMinRating]   = useState(initialFilters.minRating ?? "");
  const [maxPrice,    setMaxPrice]    = useState(initialFilters.maxPrice   ?? "");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (destination)    params.set("destination", destination);
    if (minRating !== "") params.set("minRating", String(minRating));
    if (maxPrice  !== "") params.set("maxPrice",  String(maxPrice));
    router.push(`${pathname}?${params.toString()}`);
  }, [destination, minRating, maxPrice, pathname, router]);

  const clearFilters = () => {
    setDestination("");
    setMinRating("");
    setMaxPrice("");
    router.push(pathname);
  };

  const hasFilters = destination || minRating !== "" || maxPrice !== "";

  return (
    <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 sticky top-28">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-[var(--color-text-primary)]">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[var(--color-brand)] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5">
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

        {/* Max price */}
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

        <Button
          onClick={applyFilters}
          variant="primary"
          className="w-full justify-center"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
