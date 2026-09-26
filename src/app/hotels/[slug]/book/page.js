import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import BookingForm from "@/components/booking/BookingForm";
import { getHotelById, getRoomById } from "@/lib/data/index";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const hotel = getHotelById(slug);
  if (!hotel) return {};
  return {
    title: `Book — ${hotel.name}`,
    description: `Complete your booking at ${hotel.name}.`,
  };
}

export default async function HotelBookPage({ params, searchParams }) {
  const { slug } = await params;
  const sp       = await searchParams;

  const hotel = getHotelById(slug);
  if (!hotel) notFound();

  // If a specific room was requested, pre-select it; otherwise default to first available
  const roomId       = sp.room || hotel.rooms[0]?.id;
  const selectedRoom = getRoomById(hotel.slug, roomId) ?? hotel.rooms[0];

  if (!selectedRoom) notFound();

  const pricePerNight = selectedRoom.pricePerNight;
  const primaryImage  = hotel.images.find((i) => i.primary) ?? hotel.images[0];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <li><Link href="/" className="hover:text-[var(--color-brand)] transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/hotels" className="hover:text-[var(--color-brand)] transition-colors">Hotels</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/hotels/${hotel.slug}`} className="hover:text-[var(--color-brand)] transition-colors">{hotel.name}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-text-secondary)]" aria-current="page">Book</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── Booking form ─────────────────────────── */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
              Complete Your Booking
            </h1>
            <BookingForm
              hotel={hotel}
              room={selectedRoom}
            />
          </div>

          {/* ── Booking summary sidebar ──────────────── */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-28 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] overflow-hidden">
              {/* Hotel image */}
              {primaryImage && (
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={primaryImage.src}
                    alt={primaryImage.alt}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 img-overlay-bottom" aria-hidden="true" />
                </div>
              )}

              <div className="p-5">
                <h2 className="font-semibold text-[var(--color-text-primary)]">{hotel.name}</h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-3">
                  {hotel.location.city}, {hotel.location.state}
                </p>

                {/* Selected room */}
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-3)] p-3 mb-4">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-0.5">Selected Room</p>
                  <p className="font-medium text-sm text-[var(--color-text-primary)]">{selectedRoom.name}</p>
                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    {selectedRoom.breakfastIncluded && <Badge variant="success">Breakfast</Badge>}
                    {selectedRoom.freeCancellation  && <Badge variant="neutral">Free cancel</Badge>}
                  </div>
                </div>

                {/* Price breakdown placeholder */}
                <div className="flex flex-col gap-2 text-sm border-t border-[var(--color-border)] pt-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Room rate</span>
                    <span className="text-[var(--color-text-primary)] font-medium">
                      {formatPrice(pricePerNight, selectedRoom.currency)}/night
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">Total shown after dates entered</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
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
