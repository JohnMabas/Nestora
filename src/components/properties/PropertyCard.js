"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

/**
 * Reusable property card.
 * @param {{ property: import('@/lib/types/index.js').Property, className?: string }} props
 */
export default function PropertyCard({ property, className = "" }) {
  const [saved, setSaved] = useState(false);

  const primaryImage = property.images.find((i) => i.primary) ?? property.images[0];
  const price        = formatPrice(property.price, property.currency);

  const listingBadgeVariant =
    property.listingType === "sale"       ? "brand"   :
    property.listingType === "rent"       ? "success" :
    property.listingType === "short-let"  ? "warning" : "neutral";

  const listingLabel =
    property.listingType === "sale"       ? "For Sale"   :
    property.listingType === "rent"       ? "For Rent"   :
    property.listingType === "short-let"  ? "Short Let"  : property.listingType;

  return (
    <article
      className={["card group relative flex flex-col", className].join(" ")}
      aria-label={property.title}
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

        {/* Gradient overlay */}
        <div className="absolute inset-0 img-overlay-bottom" aria-hidden="true" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge variant={listingBadgeVariant}>{listingLabel}</Badge>
          {property.recent && (
            <Badge variant="surface">New</Badge>
          )}
        </div>

        {/* Favourite button */}
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save property"}
          aria-pressed={saved}
          onClick={() => setSaved((v) => !v)}
          className={[
            "absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200",
            saved
              ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-text-inverse)]"
              : "border-[var(--color-border-strong)] bg-[var(--color-surface-0)]/60 text-[var(--color-text-secondary)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] backdrop-blur-sm",
          ].join(" ")}
        >
          <HeartIcon filled={saved} />
        </button>

        {/* Property type pill — bottom left */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-0)]/70 px-2.5 py-0.5 text-xs capitalize text-[var(--color-text-secondary)] backdrop-blur-sm">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title & location */}
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)] leading-snug line-clamp-1 group-hover:text-[var(--color-brand)] transition-colors">
            <Link
              href={`/properties/${property.slug}`}
              className="focus-visible:outline-none after:absolute after:inset-0"
            >
              {property.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
            <LocationPin />
            {property.location.city}, {property.location.state}
          </p>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-4 border-t border-[var(--color-border)] pt-3 text-sm text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1.5" title={`${property.bedrooms} bedrooms`}>
            <BedIcon />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5" title={`${property.bathrooms} bathrooms`}>
            <BathIcon />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5" title={`${property.area} sqm`}>
            <AreaIcon />
            {property.area} m²
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Price</p>
            <p className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
              {price}
              {property.pricePeriod && (
                <span className="text-sm font-normal text-[var(--color-text-muted)]">
                  {property.pricePeriod}
                </span>
              )}
            </p>
          </div>
          <Button
            href={`/properties/${property.slug}`}
            variant="outline"
            size="sm"
            aria-label={`View ${property.title}`}
          >
            View
          </Button>
        </div>
      </div>
    </article>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(amount, currency = "NGN") {
  if (currency === "NGN") {
    if (amount >= 1_000_000_000) return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
    if (amount >= 1_000_000)     return `₦${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000)         return `₦${(amount / 1_000).toFixed(0)}K`;
    return `₦${amount.toLocaleString()}`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact" }).format(amount);
}

// ─── Icons ───────────────────────────────────────────────────────────────────

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

function BedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v5" />
      <path d="M2 20v-5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v5" />
      <path d="M2 20h20" />
      <path d="M2 9h20" />
      <path d="M7 9V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <line x1="10" x2="8" y1="5" y2="7" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="7" x2="7" y1="19" y2="21" />
      <line x1="17" x2="17" y1="19" y2="21" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}
