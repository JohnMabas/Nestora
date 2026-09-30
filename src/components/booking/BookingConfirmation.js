"use client";

import { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

/**
 * Reads booking details from sessionStorage (set by BookingForm on submission).
 * Shows a confirmation screen with all booking details.
 */
export default function BookingConfirmation() {
  const [booking, setBooking] = useState(null);
  const [loaded,  setLoaded]  = useState(false);

  useEffect(() => {
    startTransition(() => {
      try {
        const raw = sessionStorage.getItem("elgaa_booking");
        if (raw) setBooking(JSON.parse(raw));
      } catch (_) {}
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--color-brand)] border-t-transparent animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">No booking found</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          It looks like you landed here directly. Start a new booking from our hotels page.
        </p>
        <Button href="/hotels" variant="primary">Browse Hotels</Button>
      </div>
    );
  }

  const checkInDate  = formatDate(booking.checkIn);
  const checkOutDate = formatDate(booking.checkOut);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success-soft)] mb-4"
          aria-hidden="true"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#5fbf6d]"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          A confirmation has been sent to{" "}
          <span className="text-[var(--color-text-primary)] font-medium">{booking.guest.email}</span>
        </p>
        <div className="mt-3 inline-block rounded-full bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/25 px-4 py-1.5 text-sm font-semibold text-[var(--color-brand)]">
          Reference: {booking.reference}
        </div>
      </div>

      {/* Booking card */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] overflow-hidden mb-6">
        {/* Hotel image */}
        {booking.hotelImage && (
          <div className="relative aspect-[16/6] w-full overflow-hidden">
            <Image
              src={booking.hotelImage}
              alt={booking.hotelName}
              fill
              sizes="672px"
              className="object-cover"
            />
            <div className="absolute inset-0 img-overlay-bottom" aria-hidden="true" />
            <div className="absolute bottom-4 left-5">
              <p className="text-xl font-bold text-white">{booking.hotelName}</p>
              <p className="text-sm text-white/80">{booking.location}</p>
            </div>
          </div>
        )}

        <div className="p-5">
          {/* Dates & room */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <InfoBlock label="Check-in" value={checkInDate} />
            <InfoBlock label="Check-out" value={checkOutDate} />
            <InfoBlock label="Duration" value={`${booking.nights} night${booking.nights !== 1 ? "s" : ""}`} />
            <InfoBlock label="Room" value={booking.roomName} />
            <InfoBlock label="Guests" value={`${booking.guests} guest${booking.guests !== 1 ? "s" : ""}`} />
            <InfoBlock label="Rooms" value={`${booking.rooms} room${booking.rooms !== 1 ? "s" : ""}`} />
          </div>

          {/* Guest info */}
          <div className="border-t border-[var(--color-border)] pt-4 mb-5">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Guest Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <InfoBlock label="Name" value={`${booking.guest.firstName} ${booking.guest.lastName}`} />
              <InfoBlock label="Email" value={booking.guest.email} />
              <InfoBlock label="Phone" value={booking.guest.phone} />
              {booking.guest.specialRequests && (
                <InfoBlock label="Requests" value={booking.guest.specialRequests} />
              )}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="border-t border-[var(--color-border)] pt-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Payment Summary</h2>
            <div className="flex flex-col gap-2 text-sm">
              <Row label={`${formatPrice(booking.pricePerNight, booking.currency)} × ${booking.nights} nights × ${booking.rooms} room${booking.rooms > 1 ? "s" : ""}`} value={formatPrice(booking.subtotal, booking.currency)} />
              <Row label="Taxes (7.5%)"    value={formatPrice(booking.taxes, booking.currency)} />
              <Row label="Service fee (5%)" value={formatPrice(booking.serviceFee, booking.currency)} />
              <div className="border-t border-[var(--color-border)] pt-2 mt-1 flex justify-between font-bold text-[var(--color-text-primary)]">
                <span>Total Paid</span>
                <span className="text-[var(--color-brand)]">{formatPrice(booking.total, booking.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policies reminder */}
      {booking.policies && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 mb-8">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Policies Reminder</h2>
          <div className="flex flex-col gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <p><span className="font-medium text-[var(--color-text-primary)]">Check-in:</span> {booking.policies.checkIn}</p>
            <p><span className="font-medium text-[var(--color-text-primary)]">Check-out:</span> {booking.policies.checkOut}</p>
            <p><span className="font-medium text-[var(--color-text-primary)]">Cancellation:</span> {booking.policies.cancellation}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button href="/hotels" variant="primary" size="lg" className="w-full sm:w-auto justify-center">
          Browse More Hotels
        </Button>
        <Button href="/" variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
          Return Home
        </Button>
        <button
          onClick={() => window.print()}
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="text-sm font-medium text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-[var(--color-text-secondary)]">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(amount, currency = "NGN") {
  if (currency === "NGN") {
    if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000)     return `₦${(amount / 1_000).toFixed(0)}K`;
    return `₦${amount.toLocaleString()}`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact" }).format(amount);
}
