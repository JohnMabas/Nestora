import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

export default function CTA() {
  return (
    <section aria-label="Call to action — list your property" className="section bg-[var(--color-surface-1)]">
      <Container>
        <FadeInOnScroll>
          <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)]">
            {/* Background image */}
            <div className="absolute inset-0" aria-hidden="true">
              <Image
                src="https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1600&q=80"
                alt="Luxury home interior"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-0)]/95 via-[var(--color-surface-0)]/80 to-[var(--color-surface-0)]/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-6 px-8 py-16 sm:px-12 lg:px-20 max-w-xl">
              <div className="flex items-center gap-2.5">
                <span className="accent-line" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
                  For Agents &amp; Owners
                </span>
              </div>

              <h2 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                Have a property <br /> to list?
              </h2>

              <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
                Reach thousands of verified buyers and renters across Nigeria. Our platform gives your listing premium exposure and connects you directly with serious enquiries — no commissions on introductions.
              </p>

              <ul className="flex flex-col gap-2 text-sm text-[var(--color-text-secondary)]">
                {[
                  "Free listing setup",
                  "Dedicated account manager",
                  "Professional photography referral",
                  "Real-time enquiry dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-brand)]/20 text-[var(--color-brand)] shrink-0">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3">
                <Button href="/contact" variant="primary" size="lg">
                  List Your Property
                </Button>
                <Button href="/about" variant="secondary" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </FadeInOnScroll>
      </Container>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
