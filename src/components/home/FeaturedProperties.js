import PropertyCard from "@/components/properties/PropertyCard";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getFeaturedProperties } from "@/lib/data/index";

export default function FeaturedProperties() {
  const properties = getFeaturedProperties(6);

  return (
    <section aria-labelledby="featured-heading" className="section bg-[var(--color-surface-1)]">
      <Container>
        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <SectionHeading
            id="featured-heading"
            eyebrow="Handpicked Listings"
            title="Featured Properties"
            subtitle="Our most sought-after homes — selected for their exceptional quality, location, and value."
          />
          <Button href="/properties?featured=true" variant="outline" size="sm" className="shrink-0 self-start sm:self-auto">
            View All
            <ArrowRight />
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
