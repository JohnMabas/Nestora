"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

/**
 * Multi-step booking form.
 * @param {{ hotel: import('@/lib/types/index.js').Hotel, room: import('@/lib/types/index.js').Room }} props
 */
export default function BookingForm({ hotel, room }) {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1 = dates & guests, 2 = guest details

  // Step 1 state
  const [checkIn,    setCheckIn]    = useState("");
  const [checkOut,   setCheckOut]   = useState("");
  const [guests,     setGuests]     = useState(1);
  const [rooms,      setRooms]      = useState(1);

  // Step 2 state
  const [firstName,  setFirstName]  = useState("");
  const [lastName,   setLastName]   = useState("");
  const [email,      setEmail]      = useState("");
  const [phone,      setPhone]      = useState("");
  const [requests,   setRequests]   = useState("");

  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ── Computed values ──────────────────────────────────────────────────────

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0;

  const subtotal   = nights * rooms * room.pricePerNight;
  const taxes      = Math.round(subtotal * 0.075);
  const serviceFee = Math.round(subtotal * 0.05);
  const total      = subtotal + taxes + serviceFee;

  // ── Validation ───────────────────────────────────────────────────────────

  function validateStep1() {
    const errs = {};
    if (!checkIn)  errs.checkIn  = "Check-in date is required.";
    if (!checkOut) errs.checkOut = "Check-out date is required.";
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      errs.checkOut = "Check-out must be after check-in.";
    }
    if (nights < 1) errs.checkOut = "Minimum stay is 1 night.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2() {
    const errs = {};
    if (!firstName.trim()) errs.firstName = "First name is required.";
    if (!lastName.trim())  errs.lastName  = "Last name is required.";
    if (!email.trim())     errs.email     = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email.";
    if (!phone.trim())     errs.phone     = "Phone number is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleNext() {
    if (validateStep1()) setStep(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep2()) return;
    setSubmitting(true);

    // Build a mock booking object and save to sessionStorage
    const booking = {
      id:           `BK-${Date.now()}`,
      reference:    `EST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      hotelId:      hotel.id,
      hotelName:    hotel.name,
      hotelSlug:    hotel.slug,
      hotelImage:   hotel.images.find((i) => i.primary)?.src ?? hotel.images[0]?.src,
      roomId:       room.id,
      roomName:     room.name,
      guest:        { firstName, lastName, email, phone, specialRequests: requests },
      checkIn,
      checkOut,
      nights,
      guests,
      rooms,
      pricePerNight: room.pricePerNight,
      subtotal,
      taxes,
      serviceFee,
      total,
      currency:     room.currency,
      status:       "confirmed",
      createdAt:    new Date().toISOString(),
      location:     `${hotel.location.city}, ${hotel.location.state}`,
      policies:     hotel.policies,
    };

    // Persist to sessionStorage so the confirmation page can read it
    try {
      sessionStorage.setItem("elgaa_booking", JSON.stringify(booking));
    } catch (_) {}

    // Simulate brief processing
    await new Promise((r) => setTimeout(r, 800));
    router.push("/booking/confirmation");
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8" aria-label="Booking steps">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                step >= s
                  ? "bg-[var(--color-brand)] text-[var(--color-text-inverse)]"
                  : "bg-[var(--color-surface-3)] text-[var(--color-text-muted)]",
              ].join(" ")}
              aria-current={step === s ? "step" : undefined}
            >
              {s}
            </span>
            <span className={step >= s ? "text-sm text-[var(--color-text-primary)]" : "text-sm text-[var(--color-text-muted)]"}>
              {s === 1 ? "Dates & Guests" : "Guest Details"}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* ── STEP 1 ─────────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Check-in Date" error={errors.checkIn} id="bf-checkin">
                <input
                  id="bf-checkin"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="input-base"
                  aria-invalid={!!errors.checkIn}
                  aria-describedby={errors.checkIn ? "bf-checkin-err" : undefined}
                />
              </FormField>

              <FormField label="Check-out Date" error={errors.checkOut} id="bf-checkout">
                <input
                  id="bf-checkout"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().slice(0, 10)}
                  className="input-base"
                  aria-invalid={!!errors.checkOut}
                  aria-describedby={errors.checkOut ? "bf-checkout-err" : undefined}
                />
              </FormField>

              <FormField label="Guests" id="bf-guests">
                <select
                  id="bf-guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="input-base"
                >
                  {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Rooms" id="bf-rooms">
                <select
                  id="bf-rooms"
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                  className="input-base"
                >
                  {Array.from({ length: Math.min(room.availableRooms, 5) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "room" : "rooms"}</option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* Price summary (shown when dates valid) */}
            {nights > 0 && (
              <PriceSummary nights={nights} rooms={rooms} room={room} subtotal={subtotal} taxes={taxes} serviceFee={serviceFee} total={total} />
            )}

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleNext}
              className="self-start"
            >
              Continue to Guest Details →
            </Button>
          </div>
        )}

        {/* ── STEP 2 ─────────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            {/* Recap */}
            {nights > 0 && (
              <PriceSummary nights={nights} rooms={rooms} room={room} subtotal={subtotal} taxes={taxes} serviceFee={serviceFee} total={total} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="First Name" error={errors.firstName} id="bf-fname">
                <input
                  id="bf-fname"
                  type="text"
                  placeholder="Ada"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-base"
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "bf-fname-err" : undefined}
                />
              </FormField>

              <FormField label="Last Name" error={errors.lastName} id="bf-lname">
                <input
                  id="bf-lname"
                  type="text"
                  placeholder="Okonkwo"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-base"
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "bf-lname-err" : undefined}
                />
              </FormField>

              <FormField label="Email Address" error={errors.email} id="bf-email">
                <input
                  id="bf-email"
                  type="email"
                  placeholder="ada@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "bf-email-err" : undefined}
                />
              </FormField>

              <FormField label="Phone Number" error={errors.phone} id="bf-phone">
                <input
                  id="bf-phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-base"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "bf-phone-err" : undefined}
                />
              </FormField>
            </div>

            <FormField label="Special Requests (optional)" id="bf-requests">
              <textarea
                id="bf-requests"
                rows={3}
                placeholder="Any dietary requirements, late check-in, accessibility needs…"
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                className="input-base resize-none"
              />
            </FormField>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                ← Back
              </button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Processing…" : `Confirm Booking — ${formatPrice(total, room.currency)}`}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FormField({ label, error, id, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} role="alert" className="text-xs text-[#d46b6b]">
          {error}
        </p>
      )}
    </div>
  );
}

function PriceSummary({ nights, rooms, room, subtotal, taxes, serviceFee, total }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Price Breakdown</h3>
      <div className="flex flex-col gap-2 text-sm">
        <Row label={`${formatPrice(room.pricePerNight, room.currency)} × ${nights} nights × ${rooms} room${rooms > 1 ? "s" : ""}`} value={formatPrice(subtotal, room.currency)} />
        <Row label="Taxes (7.5%)"   value={formatPrice(taxes, room.currency)} />
        <Row label="Service fee (5%)" value={formatPrice(serviceFee, room.currency)} />
        <div className="border-t border-[var(--color-border)] pt-2 mt-1 flex justify-between font-semibold text-[var(--color-text-primary)]">
          <span>Total</span>
          <span className="text-[var(--color-brand)]">{formatPrice(total, room.currency)}</span>
        </div>
      </div>
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

function formatPrice(amount, currency = "NGN") {
  if (currency === "NGN") {
    if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000)     return `₦${(amount / 1_000).toFixed(0)}K`;
    return `₦${amount.toLocaleString()}`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact" }).format(amount);
}
