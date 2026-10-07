"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

const tabs = ["Buy", "Rent", "Short Let", "Hotels"];

const locations = [
  "Jos",
  "Abuja",
  "Plateau State",
  "Maitama",
  "Wuse 2",
  "Asokoro",
  "Gwarinpa",
  "Rayfield",
  "Jos North",
  "Jos South",
];

const propertyTypes = [
  "Any Type",
  "Apartment",
  "House",
  "Villa",
  "Penthouse",
  "Studio",
  "Duplex",
  "Land",
  "Commercial",
];

const priceRanges = [
  { label: "Any Price",      value: "" },
  { label: "Under ₦50M",     value: "0-50000000" },
  { label: "₦50M – ₦150M",  value: "50000000-150000000" },
  { label: "₦150M – ₦500M", value: "150000000-500000000" },
  { label: "₦500M+",         value: "500000000-9999999999" },
];

export default function PropertySearch() {
  const router = useRouter();
  const [activeTab, setActiveTab]     = useState("Buy");
  const [location,  setLocation]      = useState("");
  const [propType,  setPropType]       = useState("Any Type");
  const [priceRange, setPriceRange]   = useState("");

  const isHotels = activeTab === "Hotels";

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (location)   params.set("location", location.toLowerCase());

    if (!isHotels) {
      const listingMap = { Buy: "sale", Rent: "rent", "Short Let": "short-let" };
      params.set("listingType", listingMap[activeTab]);

      if (propType && propType !== "Any Type") {
        params.set("type", propType.toLowerCase());
      }
      if (priceRange) {
        const [min, max] = priceRange.split("-");
        if (min) params.set("minPrice", min);
        if (max) params.set("maxPrice", max);
      }
      router.push(`/properties?${params}`);
    } else {
      router.push(`/hotels?${params}`);
    }
  };

  return (
    <section
      aria-label="Property and hotel search"
      className="relative z-20 -mb-5 pb-6"
    >
      <Container>
        <FadeInOnScroll>
        <div className="rounded-[var(--radius-2xl)] mt-10 border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 shadow-2xl shadow-black/40">
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 p-1 bg-[var(--color-surface-3)] rounded-[var(--radius-lg)] w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                className={[
                  "px-5 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-all duration-200",
                  activeTab === tab
                    ? "bg-[var(--color-brand)] text-[var(--color-text-inverse)] shadow-sm"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                ].join(" ")}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} role="search" aria-label={`Search ${isHotels ? "hotels" : "properties"}`}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="search-location" className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                  {isHotels ? "Destination" : "Location"}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true">
                    <LocationPin />
                  </span>
                  <input
                    id="search-location"
                    list="location-suggestions"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={isHotels ? "City or destination…" : "City, area or address…"}
                    className="input-base pl-9"
                  />
                  <datalist id="location-suggestions">
                    {locations.map((l) => <option key={l} value={l} />)}
                  </datalist>
                </div>
              </div>

              {/* Property type (hidden for Hotels) */}
              {!isHotels && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="search-type" className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                    Property Type
                  </label>
                  <select
                    id="search-type"
                    value={propType}
                    onChange={(e) => setPropType(e.target.value)}
                    className="input-base select"
                  >
                    {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}

              {/* Check-in / Check-out for hotels */}
              {isHotels && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="hotel-checkin" className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                      Check-in
                    </label>
                    <input
                      id="hotel-checkin"
                      type="date"
                      className="input-base"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="hotel-checkout" className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                      Check-out
                    </label>
                    <input
                      id="hotel-checkout"
                      type="date"
                      className="input-base"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </>
              )}

              {/* Price range (properties only) */}
              {!isHotels && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="search-price" className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                    Budget
                  </label>
                  <select
                    id="search-price"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="input-base select"
                  >
                    {priceRanges.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Search button */}
              <div className="flex flex-col justify-end">
                <Button type="submit" variant="primary" size="md" className="h-[42px] w-full">
                  <SearchIcon />
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Quick filters */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)]">Popular:</span>
            {["Jos Villas", "Abuja Apartments", "Maitama", "Rayfield Resort Area"].map((tag) => (
              <button
                key={tag}
                type="button"
                className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
                onClick={() => {
                  setLocation(tag);
                  router.push(`/properties?location=${encodeURIComponent(tag.toLowerCase())}`);
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        </FadeInOnScroll>
      </Container>
    </section>
  );
}

function LocationPin() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
