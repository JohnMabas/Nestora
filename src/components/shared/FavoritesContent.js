"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { getPropertyById } from "@/lib/data/index";
import { getHotelById } from "@/lib/data/index";
import PropertyCard from "@/components/properties/PropertyCard";
import HotelCard from "@/components/hotels/HotelCard";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";

export default function FavoritesContent() {
  const { savedProperties, savedHotels, clearAll } = useFavorites();
  const [activeTab, setActiveTab] = useState("properties");

  // Resolve IDs to full objects
  const favoriteProperties = savedProperties
    .map((id) => getPropertyById(id))
    .filter(Boolean);

  const favoriteHotels = savedHotels
    .map((id) => getHotelById(id))
    .filter(Boolean);

  const totalCount = favoriteProperties.length + favoriteHotels.length;
  const hasProperties = favoriteProperties.length > 0;
  const hasHotels     = favoriteHotels.length > 0;
  const hasAny        = totalCount > 0;

  if (!hasAny) {
    return <EmptyFavorites />;
  }

  return (
    <div>
      {/* Summary row */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <p className="text-sm text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-text-primary)]">{totalCount}</span>{" "}
          saved item{totalCount !== 1 ? "s" : ""}
        </p>
        <button
          onClick={clearAll}
          className="text-sm text-[var(--color-error)] hover:underline transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Tabs (only show if both types have items) */}
      {hasProperties && hasHotels && (
        <div className="flex items-center gap-1 mb-8 p-1 bg-[var(--color-surface-3)] rounded-[var(--radius-lg)] w-fit">
          <TabButton active={activeTab === "properties"} onClick={() => setActiveTab("properties")}>
            Properties
            <span className="ml-1.5 rounded-full bg-[var(--color-surface-4)] px-1.5 py-0.5 text-xs font-medium text-[var(--color-text-muted)]">
              {favoriteProperties.length}
            </span>
          </TabButton>
          <TabButton active={activeTab === "hotels"} onClick={() => setActiveTab("hotels")}>
            Hotels
            <span className="ml-1.5 rounded-full bg-[var(--color-surface-4)] px-1.5 py-0.5 text-xs font-medium text-[var(--color-text-muted)]">
              {favoriteHotels.length}
            </span>
          </TabButton>
        </div>
      )}

      {/* Properties grid */}
      {(activeTab === "properties" || !hasHotels) && hasProperties && (
        <section aria-labelledby="fav-props-heading">
          {hasHotels && (
            <h2 id="fav-props-heading" className="text-lg font-semibold text-[var(--color-text-primary)] mb-5">
              Saved Properties
            </h2>
          )}
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Saved properties">
            {favoriteProperties.map((property) => (
              <li key={property.id}>
                <PropertyCard property={property} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Hotels grid */}
      {(activeTab === "hotels" || !hasProperties) && hasHotels && (
        <section aria-labelledby="fav-hotels-heading" className={hasProperties && activeTab === "properties" ? "hidden" : ""}>
          {hasProperties && (
            <h2 id="fav-hotels-heading" className="text-lg font-semibold text-[var(--color-text-primary)] mb-5">
              Saved Hotels
            </h2>
          )}
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Saved hotels">
            {favoriteHotels.map((hotel) => (
              <li key={hotel.id}>
                <HotelCard hotel={hotel} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Browse more CTA */}
      <div className="mt-16 border-t border-[var(--color-border)] pt-10">
        <p className="text-sm text-[var(--color-text-muted)] mb-4">Discover more</p>
        <div className="flex flex-wrap gap-3">
          <Button href="/properties" variant="secondary" size="md">Browse Properties</Button>
          <Button href="/hotels" variant="secondary" size="md">Browse Hotels</Button>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "flex items-center px-5 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-all duration-200",
        active
          ? "bg-[var(--color-brand)] text-[var(--color-text-inverse)] shadow-sm"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function EmptyFavorites() {
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
            { label: "Villas for sale",  href: "/properties?type=villa&listingType=sale" },
            { label: "Jos apartments",   href: "/properties?location=Jos&type=apartment" },
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
