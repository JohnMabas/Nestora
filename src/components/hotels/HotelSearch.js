"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

/**
 * Hotel search bar — destination, check-in, check-out, guests, rooms.
 * Pushes URL params to /hotels on submit.
 *
 * @param {{ initialValues?: { destination?: string, checkIn?: string, checkOut?: string, guests?: number, rooms?: number } }} props
 */
export default function HotelSearch({ initialValues = {} }) {
  const router = useRouter();

  const today    = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [destination, setDestination] = useState(initialValues.destination || "");
  const [checkIn,     setCheckIn]     = useState(initialValues.checkIn     || "");
  const [checkOut,    setCheckOut]    = useState(initialValues.checkOut    || "");
  const [guests,      setGuests]      = useState(initialValues.guests      || 2);
  const [rooms,       setRooms]       = useState(initialValues.rooms       || 1);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (checkIn)     params.set("checkIn",     checkIn);
    if (checkOut)    params.set("checkOut",    checkOut);
    params.set("guests", String(guests));
    params.set("rooms",  String(rooms));
    router.push(`/hotels?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      aria-label="Search hotels"
      className="w-full rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 shadow-lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Destination */}
        <div className="lg:col-span-2 flex flex-col gap-1">
          <label htmlFor="hs-dest" className="text-xs font-medium text-[var(--color-text-secondary)]">
            Destination
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
              <LocationIcon />
            </span>
            <input
              id="hs-dest"
              type="text"
              placeholder="City or hotel name"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input-base pl-9"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex flex-col gap-1">
          <label htmlFor="hs-checkin" className="text-xs font-medium text-[var(--color-text-secondary)]">
            Check-in
          </label>
          <input
            id="hs-checkin"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={today}
            className="input-base"
            placeholder={today}
          />
        </div>

        {/* Check-out */}
        <div className="flex flex-col gap-1">
          <label htmlFor="hs-checkout" className="text-xs font-medium text-[var(--color-text-secondary)]">
            Check-out
          </label>
          <input
            id="hs-checkout"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || today}
            className="input-base"
            placeholder={tomorrow}
          />
        </div>

        {/* Guests / Rooms — combined on smaller screens */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">
            Guests / Rooms
          </label>
          <div className="flex gap-2">
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="input-base"
              aria-label="Number of guests"
            >
              {[1,2,3,4,5,6,7,8].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
              ))}
            </select>
            <select
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="input-base"
              aria-label="Number of rooms"
            >
              {[1,2,3,4,5].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "room" : "rooms"}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search button */}
      <div className="mt-3 flex justify-end">
        <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto justify-center">
          <SearchIcon />
          Search Hotels
        </Button>
      </div>
    </form>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
