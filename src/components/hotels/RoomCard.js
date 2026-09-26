import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

/**
 * @param {{ room: import('@/lib/types/index.js').Room, hotelSlug: string }} props
 */
export default function RoomCard({ room, hotelSlug }) {
  const primaryImage = room.images.find((i) => i.primary) ?? room.images[0];
  const price        = formatPrice(room.pricePerNight, room.currency);

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] overflow-hidden flex flex-col sm:flex-row">
      {/* Room image */}
      {primaryImage && (
        <div className="relative w-full sm:w-52 shrink-0 aspect-[4/3] sm:aspect-auto sm:h-auto overflow-hidden bg-[var(--color-surface-3)]">
          <Image
            src={primaryImage.src}
            alt={primaryImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, 208px"
            className="object-cover img-smooth"
          />
        </div>
      )}

      {/* Room details */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex flex-wrap items-start gap-2 mb-2">
            <h3 className="font-semibold text-[var(--color-text-primary)]">{room.name}</h3>
            {room.view && (
              <Badge variant="brand">{room.view} View</Badge>
            )}
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
            {room.description}
          </p>

          {/* Specs */}
          <div className="flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)] mb-3">
            <span className="flex items-center gap-1">
              <BedIcon />
              {room.bedCount}× {room.bedType} bed
            </span>
            <span className="flex items-center gap-1">
              <GuestIcon />
              Up to {room.maxGuests} guests
            </span>
            <span className="flex items-center gap-1">
              <AreaIcon />
              {room.size} m²
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {room.breakfastIncluded && (
              <Badge variant="success">Breakfast included</Badge>
            )}
            {room.freeCancellation && (
              <Badge variant="neutral">Free cancellation</Badge>
            )}
            {room.availableRooms <= 2 && room.availableRooms > 0 && (
              <Badge variant="warning">Only {room.availableRooms} left</Badge>
            )}
            {room.availableRooms === 0 && (
              <Badge variant="error">Sold out</Badge>
            )}
          </div>

          {/* Amenities chips */}
          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.slice(0, 5).map((a) => (
                <span
                  key={a.label}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-3)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)]"
                >
                  {a.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Per night</p>
            <p className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {price}
            </p>
          </div>
          {room.availableRooms > 0 ? (
            <Button
              href={`/hotels/${hotelSlug}/book?room=${room.id}`}
              variant="primary"
              size="sm"
            >
              Book Room
            </Button>
          ) : (
            <Button variant="ghost" size="sm" disabled>
              Unavailable
            </Button>
          )}
        </div>
      </div>
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

// ─── Icons ───────────────────────────────────────────────────────────────────

function BedIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 9V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v5M2 20v-5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v5M2 20h20M2 9h20M7 9V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" /></svg>;
}
function GuestIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function AreaIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>;
}
