import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import HotelCard from "@/components/hotels/HotelCard";
import HotelImageGallery from "@/components/hotels/HotelImageGallery";
import RoomCard from "@/components/hotels/RoomCard";
import { getHotelById, getSimilarHotels } from "@/lib/data/index";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const hotel = getHotelById(slug);
  if (!hotel) return {};
  return {
    title: hotel.name,
    description: hotel.description.slice(0, 160),
  };
}

export default async function HotelDetailPage({ params }) {
  const { slug } = await params;
  const hotel = getHotelById(slug);
  if (!hotel) notFound();

  const similar    = getSimilarHotels(hotel.id, 3);
  const priceFrom  = formatPrice(hotel.priceFrom, hotel.currency);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Breadcrumb */}
      <Container>
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <li><Link href="/" className="hover:text-[var(--color-brand)] transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/hotels" className="hover:text-[var(--color-brand)] transition-colors">Hotels</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-text-secondary)] truncate max-w-[200px]" aria-current="page">{hotel.name}</li>
          </ol>
        </nav>
      </Container>

      {/* Image gallery */}
      <HotelImageGallery images={hotel.images} title={hotel.name} />

      <Container>
        <div className="mt-8 flex flex-col lg:flex-row gap-10">
          {/* ── Left column ─────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Hotel header */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StarRating rating={hotel.starRating} />
              <Badge variant="neutral" className="capitalize">{hotel.hotelType}</Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mt-2 mb-1">
              {hotel.name}
            </h1>
            <p className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-sm mb-4">
              <LocationPin />
              {hotel.location.address}, {hotel.location.city}, {hotel.location.state}
            </p>

            {/* Rating pill */}
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/25 px-3 py-1 text-sm font-semibold text-[var(--color-brand)]">
                ★ {hotel.guestRating}
                <span className="font-normal text-[var(--color-text-muted)]">/ 10</span>
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">
                {hotel.reviewCount.toLocaleString()} guest reviews
              </span>
            </div>

            {/* Description */}
            <section aria-labelledby="desc-heading" className="mb-8">
              <h2 id="desc-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
                About this hotel
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {hotel.description}
              </p>
            </section>

            {/* Amenities */}
            {hotel.amenities?.length > 0 && (
              <section aria-labelledby="amenities-heading" className="mb-8">
                <h2 id="amenities-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Hotel Amenities
                </h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((a) => (
                    <li
                      key={a.label}
                      className={[
                        "flex items-center gap-2.5 rounded-[var(--radius-md)] border px-3 py-2.5 text-sm",
                        a.highlight
                          ? "border-[var(--color-brand)]/30 bg-[var(--color-brand)]/8 text-[var(--color-brand)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]",
                      ].join(" ")}
                    >
                      <span aria-hidden="true">{a.highlight ? "★" : "✦"}</span>
                      {a.label}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Rooms */}
            {hotel.rooms?.length > 0 && (
              <section aria-labelledby="rooms-heading" className="mb-8">
                <h2 id="rooms-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Available Rooms
                </h2>
                <div className="flex flex-col gap-4">
                  {hotel.rooms.map((room) => (
                    <RoomCard key={room.id} room={room} hotelSlug={hotel.slug} />
                  ))}
                </div>
              </section>
            )}

            {/* Policies */}
            {hotel.policies && (
              <section aria-labelledby="policies-heading" className="mb-8">
                <h2 id="policies-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Hotel Policies
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Check-in",     value: hotel.policies.checkIn },
                    { label: "Check-out",    value: hotel.policies.checkOut },
                    { label: "Cancellation", value: hotel.policies.cancellation },
                    hotel.policies.children && { label: "Children", value: hotel.policies.children },
                    hotel.policies.pets     && { label: "Pets",     value: hotel.policies.pets },
                    hotel.policies.smoking  && { label: "Smoking",  value: hotel.policies.smoking },
                  ].filter(Boolean).map(({ label, value }) => (
                    <div key={label} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                      <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">{label}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">{value}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Guest reviews */}
            {hotel.reviews?.length > 0 && (
              <section aria-labelledby="reviews-heading" className="mb-8">
                <h2 id="reviews-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Guest Reviews
                </h2>
                <div className="flex flex-col gap-4">
                  {hotel.reviews.map((review) => (
                    <div key={review.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden">
                          <Image
                            src={review.authorAvatar}
                            alt={review.authorName}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm text-[var(--color-text-primary)]">{review.authorName}</p>
                            <span className="text-xs text-[var(--color-text-muted)]">
                              {new Date(review.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={i < review.rating ? "text-[var(--color-brand)]" : "text-[var(--color-surface-4)]"} aria-hidden="true">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Nearby attractions */}
            {hotel.nearbyAttractions?.length > 0 && (
              <section aria-labelledby="nearby-heading" className="mb-8">
                <h2 id="nearby-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Nearby Attractions
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {hotel.nearbyAttractions.map((a) => (
                    <li key={a}>
                      <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-1 text-sm text-[var(--color-text-secondary)]">
                        {a}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* ── Right column (sticky sidebar) ─────────── */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-28 bg-[var(--color-surface-2)] border border-[var(--color-brand)]/20 rounded-[var(--radius-xl)] p-5">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Rooms from</p>
              <p className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-1">
                {priceFrom}
                <span className="text-base font-normal text-[var(--color-text-muted)]">/night</span>
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mb-5">
                Taxes and fees may apply
              </p>

              <Button
                href={`/hotels/${hotel.slug}/book`}
                variant="primary"
                size="lg"
                className="w-full justify-center"
              >
                Book Now
              </Button>

              <div className="mt-4 flex flex-col gap-2 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5">
                  <ShieldIcon /> Free cancellation on select rooms
                </span>
                <span className="flex items-center gap-1.5">
                  <ClockIcon /> No prepayment needed
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar hotels */}
        {similar.length > 0 && (
          <section aria-labelledby="similar-heading" className="mt-16">
            <div className="flex items-end justify-between mb-8">
              <SectionHeading eyebrow="You may also like" title="Similar Hotels" />
              <Button href="/hotels" variant="ghost" size="sm">View all</Button>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((h) => (
                <li key={h.id}><HotelCard hotel={h} /></li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </div>
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

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} star hotel`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={i < rating ? "text-[var(--color-brand)]" : "text-[var(--color-surface-4)]"} aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function LocationPin() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function ShieldIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function ClockIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
