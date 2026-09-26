import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const stats = [
  { value: "2,400+", label: "Properties Listed" },
  { value: "340+",   label: "Hotels Available" },
  { value: "18K+",   label: "Happy Clients" },
  { value: "12",     label: "Years in Business" },
];

export default function Hero() {
  return (
    <section
      aria-label="Hero — discover premium properties and hotels"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85"
          alt="Luxury property aerial view"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Layered gradient overlay — dark base on the left, atmospheric top */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-0)] via-[var(--color-surface-0)]/80 to-[var(--color-surface-0)]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-1)] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <Container className="relative z-10 pt-28 pb-20 lg:pt-36 lg:pb-24">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-6">
            <span className="accent-line" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
              Premium Real Estate &amp; Hotel Discovery
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-[var(--color-text-primary)] sm:text-6xl lg:text-7xl">
            Find Your{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[var(--color-brand)]">Perfect</span>
            </span>
            <br />
            Place to{" "}
            <span className="text-[var(--color-text-secondary)]">Live</span> &amp;{" "}
            <span className="text-[var(--color-text-secondary)]">Stay</span>
          </h1>

          {/* Sub-copy */}
          <p className="mt-6 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg max-w-lg">
            Discover luxury properties for sale and rent across Nigeria — and book
            the finest hotels from a single, beautifully curated platform.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="/properties" variant="primary" size="lg">
              Explore Properties
              <ArrowRight />
            </Button>
            <Button href="/hotels" variant="secondary" size="lg">
              Discover Hotels
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)]">Trusted by</span>
            {["Zenith Bank", "First Bank", "Flutterwave"].map((brand) => (
              <span
                key={brand}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/60 px-3 py-1 text-xs text-[var(--color-text-muted)] backdrop-blur-sm"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </Container>

      {/* Stats bar */}
      <div className="absolute bottom-0 inset-x-0 z-10 border-t border-[var(--color-border)] bg-[var(--color-surface-0)]/80 backdrop-blur-md">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-[var(--color-border)] sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-0.5 py-4 px-6 text-center">
                <span className="text-2xl font-bold tracking-tight text-[var(--color-brand)]">
                  {stat.value}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">{stat.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
