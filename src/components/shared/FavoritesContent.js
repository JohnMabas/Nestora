"use client";

/**
 * FavoritesContent
 *
 * Since the app uses only mock data and no auth, favourites are stored in
 * localStorage. The PropertyCard / HotelCard components use internal state
 * for the heart button — this page shows a helpful empty state with links
 * to the listing pages, since persisting across components would require a
 * Context/Provider that's beyond the current scope.
 */
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function FavoritesContent() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
      {/* Heart illustration */}
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-surface-3)] border border-[var(--color-border)]"
        aria-hidden="true"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-brand)]"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
        No saved items yet
      </h2>
      <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-8">
        Tap the{" "}
        <svg
          className="inline-block align-middle"
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
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>{" "}
        icon on any property or hotel card to save it here for quick access later.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button href="/properties" variant="primary" size="md">
          Browse Properties
        </Button>
        <Button href="/hotels" variant="secondary" size="md">
          Browse Hotels
        </Button>
      </div>

      {/* Quick links */}
      <div className="mt-12 w-full border-t border-[var(--color-border)] pt-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
          Explore popular picks
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: "Villas for sale", href: "/properties?type=villa&listingType=sale" },
            { label: "Jos apartments", href: "/properties?location=Jos&type=apartment" },
            { label: "5★ Hotels",        href: "/hotels?minRating=5" },
            { label: "Abuja hotels",     href: "/hotels?destination=Abuja" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)]/50 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
