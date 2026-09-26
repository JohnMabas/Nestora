import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const testimonials = [
  {
    id: 1,
    quote:
      "EstateOne made buying my first home in Lagos genuinely enjoyable. Amara was incredibly patient and the process felt transparent from day one. The property portal kept me informed every step of the way.",
    authorName:   "Tobi Adeyemi",
    authorRole:   "First-time buyer, Lekki",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "I was relocating from London and needed both short-term hotel accommodation and a long-term rental sorted. EstateOne handled both in one seamless conversation. I was genuinely impressed.",
    authorName:   "Chisom Obi",
    authorRole:   "Corporate relocation, Abuja",
    authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "As a property investor I've used many platforms over the years. EstateOne stands out for its depth of data and the quality of its agent network. Three acquisitions and counting.",
    authorName:   "Emeka Okafor",
    authorRole:   "Real estate investor, Lagos & Abuja",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="section bg-[var(--color-surface-0)]"
    >
      <Container>
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Client Stories"
          title="What our clients say"
          subtitle="Real experiences from people who found their perfect place through EstateOne."
          align="center"
          className="mx-auto mb-12 max-w-xl"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={i < t.rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    className={i < t.rating ? "text-[var(--color-brand)]" : "text-[var(--color-surface-4)]"}
                    aria-hidden="true"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1">
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  "{t.quote}"
                </p>
              </blockquote>

              {/* Author */}
              <figcaption className="flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[var(--color-border)]">
                  <Image
                    src={t.authorAvatar}
                    alt={t.authorName}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{t.authorName}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.authorRole}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-sm text-[var(--color-text-muted)]">Rated 4.9 / 5 from 3,200+ verified reviews</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-brand)]" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
