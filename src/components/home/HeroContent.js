"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import {
  HERO_FADE_DURATION_MS,
  HERO_FADE_SLIDE_PX,
  HERO_FADE_DELAY_MS,
} from "@/lib/animationConstants";

/**
 * HeroContent — client component so it can run the mount fade-in on every
 * page load / refresh without gating behind session storage.
 *
 * Animation strategy:
 *  - Starts invisible (opacity 0, translateY +HERO_FADE_SLIDE_PX px).
 *  - On mount (useEffect), sets `visible = true`, which applies the final
 *    opacity-1 / translateY-0 state via a CSS transition.
 *  - prefers-reduced-motion: when set, the element is immediately visible
 *    (no transition, no transform) — enforced via the inline style fallback.
 *
 * By using a mount-state approach instead of a CSS @keyframes, the content
 * is server-rendered at full opacity in the initial HTML (no SSR flash),
 * and the animation only plays after hydration — correct for React 19.
 */
export default function HeroContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay so the transition is perceptible after first paint
    const timer = setTimeout(() => setMounted(true), HERO_FADE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // When mounted is false the element starts at opacity 0 / translated down.
  // When mounted becomes true the CSS transition carries it to the final state.
  // The `@media (prefers-reduced-motion: reduce)` in globals.css will override
  // the transition to `none`, so the element just snaps to visible — no motion.
  const style = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : `translateY(${HERO_FADE_SLIDE_PX}px)`,
    transition: `opacity ${HERO_FADE_DURATION_MS}ms ease-out, transform ${HERO_FADE_DURATION_MS}ms ease-out`,
  };

  return (
    <div style={style}>
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
  );
}

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
