import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyImageGallery from "@/components/properties/PropertyImageGallery";
import { getPropertyById, getSimilarProperties } from "@/lib/data/index";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = getPropertyById(slug);
  if (!property) return {};
  return {
    title: property.title,
    description: property.description.slice(0, 160),
  };
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const property = getPropertyById(slug);
  if (!property) notFound();

  const similar    = getSimilarProperties(property.id, 3);
  const price      = formatPrice(property.price, property.currency);

  const listingLabel =
    property.listingType === "sale"      ? "For Sale"  :
    property.listingType === "rent"      ? "For Rent"  :
    property.listingType === "short-let" ? "Short Let" : property.listingType;

  const listingVariant =
    property.listingType === "sale"      ? "brand"   :
    property.listingType === "rent"      ? "success" :
    property.listingType === "short-let" ? "warning" : "neutral";

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Breadcrumb */}
      <Container>
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <li><Link href="/" className="hover:text-[var(--color-brand)] transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/properties" className="hover:text-[var(--color-brand)] transition-colors">Properties</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-text-secondary)] truncate max-w-[200px]" aria-current="page">{property.title}</li>
          </ol>
        </nav>
      </Container>

      {/* Image gallery */}
      <PropertyImageGallery images={property.images} title={property.title} />

      <Container>
        <div className="mt-8 flex flex-col lg:flex-row gap-10">
          {/* ── Left column ─────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <Badge variant={listingVariant}>{listingLabel}</Badge>
              <Badge variant="neutral" className="capitalize">{property.propertyType}</Badge>
              {property.recent && <Badge variant="surface">New</Badge>}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mt-2 mb-1">
              {property.title}
            </h1>
            <p className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-sm mb-6">
              <LocationPin />
              {property.location.address}, {property.location.city}, {property.location.state}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-5 p-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-lg)] mb-8">
              <Stat icon={<BedIcon />}  label="Bedrooms"  value={property.bedrooms} />
              <Stat icon={<BathIcon />} label="Bathrooms" value={property.bathrooms} />
              <Stat icon={<AreaIcon />} label="Area"      value={`${property.area} m²`} />
              {property.parkingSpaces && (
                <Stat icon={<CarIcon />} label="Parking" value={property.parkingSpaces} />
              )}
              {property.yearBuilt && (
                <Stat icon={<CalendarIcon />} label="Year Built" value={property.yearBuilt} />
              )}
            </div>

            {/* Description */}
            <section aria-labelledby="desc-heading" className="mb-8">
              <h2 id="desc-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
                About this property
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </section>

            {/* Features */}
            {property.features?.length > 0 && (
              <section aria-labelledby="features-heading" className="mb-8">
                <h2 id="features-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Features
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)]">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <section aria-labelledby="amenities-heading" className="mb-8">
                <h2 id="amenities-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Amenities
                </h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <li
                      key={a.label}
                      className="flex items-center gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm text-[var(--color-text-secondary)]"
                    >
                      <span className="text-[var(--color-brand)] text-base" aria-hidden="true">✦</span>
                      {a.label}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Location map placeholder */}
            <section aria-labelledby="location-heading" className="mb-8">
              <h2 id="location-heading" className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                Location
              </h2>
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] overflow-hidden">
                <div className="flex items-center justify-center h-52 text-[var(--color-text-muted)]">
                  <div className="text-center">
                    <MapIcon className="mx-auto mb-2 text-[var(--color-text-muted)]" />
                    <p className="text-sm">{property.location.address}</p>
                    <p className="text-xs mt-1">{property.location.city}, {property.location.state}, {property.location.country}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ── Right column (sticky sidebar) ─────────── */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-28 flex flex-col gap-5">
              {/* Price card */}
              <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">
                  {property.listingType === "rent" ? "Monthly rent" : property.listingType === "short-let" ? "Per month" : "Asking price"}
                </p>
                <p className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
                  {price}
                  {property.pricePeriod && (
                    <span className="text-base font-normal text-[var(--color-text-muted)]">{property.pricePeriod}</span>
                  )}
                </p>
              </div>

              {/* Agent card */}
              <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5">
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Listed by</h2>
                <Link href={`/agents/${property.agent.id}`} className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity group">
                  <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border border-[var(--color-border)] group-hover:border-[var(--color-brand)] transition-colors">
                    <Image
                      src={property.agent.photo}
                      alt={property.agent.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)] text-sm group-hover:text-[var(--color-brand)] transition-colors">{property.agent.name}</p>
                    {property.agent.yearsExperience && (
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {property.agent.yearsExperience} yrs experience
                      </p>
                    )}
                    {property.agent.listingCount && (
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {property.agent.listingCount} listings
                      </p>
                    )}
                  </div>
                </Link>

                <div className="flex flex-col gap-2.5">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center justify-center gap-2 h-11 px-5 rounded-[var(--radius-md)] bg-[var(--color-brand)] text-[var(--color-text-inverse)] text-sm font-medium hover:bg-[var(--color-brand-light)] transition-colors"
                  >
                    <PhoneIcon /> Call Agent
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center justify-center gap-2 h-11 px-5 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface-3)] text-[var(--color-text-primary)] text-sm font-medium hover:border-[var(--color-brand)] transition-colors"
                  >
                    <MailIcon /> Email Agent
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <section aria-labelledby="similar-heading" className="mt-16">
            <div className="flex items-end justify-between mb-8">
              <SectionHeading
                eyebrow="You may also like"
                title="Similar Properties"
              />
              <Button href="/properties" variant="ghost" size="sm">
                View all
              </Button>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((p) => (
                <li key={p.id}>
                  <PropertyCard property={p} />
                </li>
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
    if (amount >= 1_000_000_000) return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
    if (amount >= 1_000_000)     return `₦${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000)         return `₦${(amount / 1_000).toFixed(0)}K`;
    return `₦${amount.toLocaleString()}`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact" }).format(amount);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span className="text-[var(--color-brand)]">{icon}</span>
      <span className="text-[var(--color-text-muted)]">{label}:</span>
      <span className="font-semibold text-[var(--color-text-primary)]">{value}</span>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function LocationPin() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function BedIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 9V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v5" /><path d="M2 20v-5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v5" /><path d="M2 20h20M2 9h20M7 9V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" /></svg>;
}
function BathIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /><line x1="10" x2="8" y1="5" y2="7" /><line x1="2" x2="22" y1="12" y2="12" /><line x1="7" x2="7" y1="19" y2="21" /><line x1="17" x2="17" y1="19" y2="21" /></svg>;
}
function AreaIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>;
}
function CarIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
}
function CalendarIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand)] shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>;
}
function PhoneIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 5.61 5.61l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function MailIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
}
function MapIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>;
}
