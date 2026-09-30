import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

const categories = [
  {
    label:    "Apartments",
    type:     "apartment",
    count:    "142 listings",
    image:    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    imageAlt: "Modern apartment interior",
  },
  {
    label:    "Villas",
    type:     "villa",
    count:    "67 listings",
    image:    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    imageAlt: "Luxury villa with pool",
  },
  {
    label:    "Penthouses",
    type:     "penthouse",
    count:    "29 listings",
    image:    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    imageAlt: "Penthouse city view",
  },
  {
    label:    "Houses",
    type:     "house",
    count:    "211 listings",
    image:    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    imageAlt: "Detached family house",
  },
  {
    label:    "Duplexes",
    type:     "duplex",
    count:    "55 listings",
    image:    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    imageAlt: "Executive duplex exterior",
  },
  {
    label:    "Studios",
    type:     "studio",
    count:    "83 listings",
    image:    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
    imageAlt: "Studio apartment interior",
  },
];

export default function PropertyCategories() {
  return (
    <section aria-labelledby="categories-heading" className="section bg-[var(--color-surface-1)]">
      <Container>
        <FadeInOnScroll className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <SectionHeading
            id="categories-heading"
            eyebrow="Browse by Type"
            title="Property Categories"
            subtitle="From compact studios to sprawling villas — find the right category for you."
          />
        </FadeInOnScroll>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <FadeInOnScroll key={cat.type} index={i}>
              <Link
                href={`/properties?type=${cat.type}`}
                className="group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] aspect-[3/4] hover:border-[var(--color-brand)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
                aria-label={`Browse ${cat.label}`}
              >
                {/* Background image */}
                <Image
                  src={cat.image}
                  alt={cat.imageAlt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-0)]/90 via-[var(--color-surface-0)]/30 to-transparent" aria-hidden="true" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-semibold text-sm text-[var(--color-text-primary)]">{cat.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{cat.count}</p>
                </div>
              </Link>
            </FadeInOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
