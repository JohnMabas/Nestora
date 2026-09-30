"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import HotelSearch from "@/components/hotels/HotelSearch";
import HotelCard from "@/components/hotels/HotelCard";
import { getFeaturedHotels } from "@/lib/data/index";

const BOOKING_STEPS = [
  { step: "01", title: "Find a hotel",     desc: "Search by destination, dates, and guest count." },
  { step: "02", title: "Select a room",    desc: "Choose from available room types that fit your needs." },
  { step: "03", title: "Confirm booking",  desc: "Enter your details and confirm in under 2 minutes." },
  { step: "04", title: "Enjoy your stay",  desc: "Receive instant confirmation and check in with ease." },
];

export default function BookingLandingClient() {
  const searchParams = useSearchParams();

  // Pre-fill search bar if coming with params (e.g. from a hotel CTA)
  const searchInitial = {
    destination: searchParams.get("destination") || "",
    checkIn:     searchParams.get("checkIn")     || "",
    checkOut:    searchParams.get("checkOut")    || "",
    guests:      Number(searchParams.get("guests")) || 2,
    rooms:       Number(searchParams.get("rooms"))  || 1,
  };

  const featuredHotels = getFeaturedHotels(3);

  return (
    <div className="min-h-screen pb-20">
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 overflow-hidden" aria-label="Booking hero">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=85"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-0)] via-[var(--color-surface-0)]/85 to-[var(--color-surface-0)]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-1)] via-transparent to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="accent-line" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
                Hotel Booking
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-[var(--color-text-primary)] leading-[1.08] sm:text-6xl">
              Book your perfect{" "}
              <span className="text-[var(--color-brand)]">stay</span>
            </h1>
            <p className="mt-5 text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
              Search from hundreds of verified hotels, resorts, and boutique stays across Jos Plateau and Abuja. No hidden fees.
            </p>
          </div>

          {/* Search bar */}
          <HotelSearch initialValues={searchInitial} />
        </Container>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className="section bg-[var(--color-surface-0)]" aria-labelledby="how-heading">
        <Container>
          <SectionHeading
            eyebrow="Simple Process"
            title="Book in 4 easy steps"
            subtitle="From search to check-in — the whole process takes less than 3 minutes."
            align="center"
            className="mx-auto mb-12 max-w-lg"
            id="how-heading"
          />

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BOOKING_STEPS.map(({ step, title, desc }, idx) => (
              <li
                key={step}
                className="relative flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6"
              >
                {/* Connector line (desktop) */}
                {idx < BOOKING_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 right-0 translate-x-1/2 w-6 h-px bg-[var(--color-border)]" aria-hidden="true" />
                )}
                <span className="text-3xl font-bold tracking-tighter text-[var(--color-brand)]/30">{step}</span>
                <h3 className="font-semibold text-[var(--color-text-primary)]">{title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{desc}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── Featured hotels ─────────────────────────────── */}
      <section className="section bg-[var(--color-surface-1)]" aria-labelledby="featured-booking-heading">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
            <SectionHeading
              eyebrow="Top Picks"
              title="Popular Hotels"
              subtitle="Handpicked for exceptional service, location, and value."
              id="featured-booking-heading"
            />
            <Button href="/hotels" variant="outline" size="sm" className="shrink-0 self-start sm:self-auto">
              Browse All Hotels
              <ArrowRight />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Reassurance strip ───────────────────────────── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-0)] py-8" aria-label="Booking assurances">
        <Container>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldIcon />, title: "Verified Hotels",       desc: "Every property is manually vetted by our team." },
              { icon: <ClockIcon />,  title: "Instant Confirmation",  desc: "Receive booking confirmation within seconds." },
              { icon: <RefundIcon />, title: "Free Cancellation",     desc: "Select rooms offer free cancellation — check before booking." },
              { icon: <SupportIcon />,title: "24/7 Support",          desc: "Our team is available around the clock to assist." },
            ].map(({ icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 text-[var(--color-brand)]">{icon}</span>
                <div>
                  <p className="font-semibold text-sm text-[var(--color-text-primary)]">{title}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ArrowRight() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}
function ShieldIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function ClockIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
function RefundIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.85" /></svg>;
}
function SupportIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 5.61 5.61l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
