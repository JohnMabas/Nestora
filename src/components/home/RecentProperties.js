import PropertyCard from "@/components/properties/PropertyCard";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getRecentProperties } from "@/lib/data/index";

export default function RecentProperties() {
  const properties = getRecentProperties(4);

  return (
    <section
      aria-labelledby="recent-heading"
      className="section bg-[var(--color-surface-0)]"
    >
      <Container>
        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <SectionHeading
            id="recent-heading"
            eyebrow="Just Added"
            title="Recent Properties"
            subtitle="Freshly listed across Jos Plateau and Abuja. Be the first to enquire."
          />
          <Button href="/properties?sort=newest" variant="outline" size="sm" className="shrink-0 self-start sm:self-auto">
            View All Properties
            <ArrowRight />
          </Button>
        </div>

        {/* 4-column grid — 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
