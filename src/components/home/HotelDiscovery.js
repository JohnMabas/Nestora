import HotelCard from "@/components/hotels/HotelCard";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getFeaturedHotels } from "@/lib/data/index";

const destinations = [
  { name: "Lagos",          image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", hotelCount: "42 hotels" },
  { name: "Abuja",          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", hotelCount: "31 hotels" },
  { name: "Port Harcourt",  image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", hotelCount: "18 hotels" },
  { name: "Ibadan",         image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80", hotelCount: "9 hotels" },
];

import Image from "next/image";
import Link from "next/link";

export default function HotelDiscovery() {
  const featuredHotels = getFeaturedHotels(3);

  return (
    <>
      {/* Popular Destinations */}
      <section aria-labelledby="destinations-heading" className="section bg-[var(--color-surface-0)]">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
            <SectionHeading
              id="destinations-heading"
              eyebrow="Hotel Stays"
              title="Popular Destinations"
              subtitle="Top hotel cities across Nigeria — find your ideal stay."
            />
            <Button href="/hotels" variant="outline" size="sm" className="shrink-0 self-start sm:self-auto">
              Browse All Hotels
              <ArrowRight />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {destinations.map((dest) => (
              <Link
                key={dest.name}
                href={`/hotels?destination=${encodeURIComponent(dest.name.toLowerCase())}`}
                className="group relative flex overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] aspect-[3/4] hover:border-[var(--color-brand)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
                aria-label={`Hotels in ${dest.name}`}
              >
                <Image
                  src={dest.image}
                  alt={`${dest.name} cityscape`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-0)]/90 via-[var(--color-surface-0)]/20 to-transparent" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-semibold text-[var(--color-text-primary)]">{dest.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{dest.hotelCount}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Hotels */}
      <section aria-labelledby="featured-hotels-heading" className="section bg-[var(--color-surface-1)]">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
            <SectionHeading
              id="featured-hotels-heading"
              eyebrow="Top Picks"
              title="Featured Hotels"
              subtitle="Exceptional stays — handpicked for their service, design, and location."
            />
            <Button href="/hotels" variant="outline" size="sm" className="shrink-0 self-start sm:self-auto">
              View All
              <ArrowRight />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
