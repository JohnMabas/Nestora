import PropertyCard from "@/components/properties/PropertyCard";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";
import { getFeaturedProperties } from "@/lib/data/index";

export default function FeaturedProperties() {
  const properties = getFeaturedProperties(6);

  return (
    <section aria-labelledby="featured-heading" className="section bg-[var(--color-surface-1)]">
      <Container>
        {/* Header row */}
        <FadeInOnScroll className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
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
        </FadeInOnScroll>

        {/* Grid — each card fades in with a stagger */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, i) => (
            <FadeInOnScroll key={property.id} index={i}>
              <PropertyCard property={property} />
            </FadeInOnScroll>
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
