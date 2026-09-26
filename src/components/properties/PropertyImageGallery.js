"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * @param {{ images: import('@/lib/types/index.js').Image[], title: string }} props
 */
export default function PropertyImageGallery({ images, title }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images?.length) return null;

  const primary = images[activeIdx] ?? images[0];

  return (
    <div className="w-full">
      {/* Main image */}
      <div className="relative w-full aspect-[16/7] bg-[var(--color-surface-2)] overflow-hidden">
        <Image
          src={primary.src}
          alt={primary.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay at bottom */}
        <div className="absolute inset-0 img-overlay-bottom" aria-hidden="true" />

        {/* Counter badge */}
        <span
          className="absolute bottom-4 right-4 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-0)]/80 px-3 py-1 text-xs text-[var(--color-text-secondary)] backdrop-blur-sm"
          aria-live="polite"
        >
          {activeIdx + 1} / {images.length}
        </span>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mt-3">
          <ul
            className="flex gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label={`${title} — image thumbnails`}
          >
            {images.map((img, idx) => (
              <li key={idx} role="presentation" className="shrink-0">
                <button
                  role="tab"
                  aria-selected={activeIdx === idx}
                  aria-label={`View image ${idx + 1}: ${img.alt}`}
                  onClick={() => setActiveIdx(idx)}
                  className={[
                    "relative h-16 w-24 overflow-hidden rounded-[var(--radius-md)] border-2 transition-all duration-200",
                    activeIdx === idx
                      ? "border-[var(--color-brand)]"
                      : "border-transparent opacity-60 hover:opacity-100",
                  ].join(" ")}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
