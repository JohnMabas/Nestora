"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  HERO_BG_INTERVAL_MS,
  HERO_BG_TRANSITION_MS,
} from "@/lib/animationConstants";

/**
 * Background images for the hero — real-estate / property themed.
 * The first image is prioritised (next/image priority) to avoid flash on
 * first paint. The rest load normally and are already in-place before they
 * become visible, so the cross-fade is always smooth.
 */
const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85",
    alt: "Luxury property aerial view",
  },
  {
    src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=85",
    alt: "Contemporary villa with pool",
  },
  {
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=85",
    alt: "Modern detached family home",
  },
  {
    src: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1920&q=85",
    alt: "Elegant interior living space",
  },
  {
    src: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1920&q=85",
    alt: "Premium apartment skyline view",
  },
];

/**
 * HeroBackground — isolated client component that handles the
 * auto-rotating cross-fade background. Keeping it separate means the
 * parent Hero server component stays a server component and only this
 * small slice runs on the client.
 *
 * Stacks all images absolutely and cycles which one is opacity-100.
 * No layout shift because the container is sized by the parent `<section>`,
 * not by these absolutely-positioned images.
 */
export default function HeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Start the rotation interval
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, HERO_BG_INTERVAL_MS);

    // Clean up on unmount to prevent memory leaks
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {HERO_IMAGES.map((img, index) => (
        <div
          key={img.src}
          className="absolute inset-0"
          style={{
            opacity: index === activeIndex ? 1 : 0,
            transition: `opacity ${HERO_BG_TRANSITION_MS}ms ease-in-out`,
            // Ensure every image layer is below the gradient overlays
            // but above nothing — parent z-0 handles overall stacking.
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            // Priority only on the first image to avoid flash on initial paint.
            // The rest load lazily; they'll be ready before they become active.
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Layered gradient overlays — identical to the original Hero.js overlays.
          Placed here (on top of images, inside this component) so they always
          sit above the rotating images and below the text content layer. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-0)] via-[var(--color-surface-0)]/80 to-[var(--color-surface-0)]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-1)] via-transparent to-transparent" />
    </div>
  );
}
