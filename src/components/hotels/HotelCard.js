"use client";

import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useFavorites } from "@/context/FavoritesContext";

/**
 * @param {{ hotel: import('@/lib/types/index.js').Hotel, className?: string }} props
 */
export default function HotelCard({ hotel, className = "" }) {
  const { isHotelSaved, toggleHotel } = useFavorites();
  const saved = isHotelSaved(hotel.id);

  const primaryImage = hotel.images.find((i) => i.primary) ?? hotel.images[0];
  const priceFormatted = formatPrice(hotel.priceFrom, hotel.currency);

  // Highlight amenities to show
  const highlightAmenities = hotel.amenities.filter((a) => a.highlight).slice(0, 3);

  return (
    <article
      className={["card group relative flex flex-col", className].join(" ")}
      aria-label={hotel.name}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={primaryImage.src}
          alt={primaryImage.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover img-smooth"
        />

        <div className="absolute inset-0 img-overlay-bottom" aria-hidden="true" />

        {/* Star rating */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-0)]/70 px-2.5 py-1 backdrop-blur-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} filled={i < hotel.starRating} />
            ))}
          </div>
        </div>

        {/* Favourite */}
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save hotel"}
          aria-pressed={saved}
          onClick={(e) => { e.preventDefault(); toggleHotel(hotel.id); }}
          className={[
            "absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200",
            saved
              ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-text-inverse)]"
              : "border-[var(--color-border-strong)] bg-[var(--color-surface-0)]/60 text-[var(--color-text-secondary)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] backdrop-blur-sm",
          ].join(" ")}
        >
          <HeartIcon filled={saved} />
        </button>

        {/* Guest rating pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-0)]/70 px-2.5 py-1 text-xs font-semibold text-[var(--color-text-primary)] backdrop-blur-sm">
            <span className="text-[var(--color-brand)]">★</span>
            {hotel.guestRating}
            <span className="text-[var(--color-text-muted)] font-normal">/ 10</span>
          </span>
          <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-0)]/60 rounded-full px-2 py-0.5 backdrop-blur-sm">
            {hotel.reviewCount.toLocaleString()} reviews
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Name & location */}
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)] leading-snug line-clamp-1 group-hover:text-[var(--color-brand)] transition-colors">
            <Link
              href={`/hotels/${hotel.slug}`}
              className="focus-visible:outline-none after:absolute after:inset-0"
            >
              {hotel.name}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
            <LocationPin />
            {hotel.location.city}, {hotel.location.state}
          </p>
        </div>

        {/* Highlight amenities */}
        {highlightAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {highlightAmenities.map((a) => (
              <span
                key={a.label}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-3)] px-2.5 py-0.5 text-xs text-[var(--color-text-secondary)]"
              >
                {a.label}
              </span>
            ))}
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-end justify-between mt-auto border-t border-[var(--color-border)] pt-3">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">From</p>
            <p className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
              {priceFormatted}
              <span className="text-sm font-normal text-[var(--color-text-muted)]">/night</span>
            </p>
          </div>
          <Button
            href={`/hotels/${hotel.slug}`}
            variant="primary"
            size="sm"
            aria-label={`Book ${hotel.name}`}
          >
            Book Now
          </Button>
        </div>
      </div>
    </article>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(amount, currency = "NGN") {
  if (currency === "NGN") {
    if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000)     return `₦${(amount / 1_000).toFixed(0)}K`;
    return `₦${amount.toLocaleString()}`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact" }).format(amount);
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function StarIcon({ filled }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={filled ? "text-[var(--color-brand)]" : "text-[var(--color-surface-4)]"} aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function LocationPin() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
