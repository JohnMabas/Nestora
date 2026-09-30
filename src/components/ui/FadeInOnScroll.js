"use client";

import { useRef, useEffect, useState } from "react";
import {
  SCROLL_FADE_DURATION_MS,
  SCROLL_FADE_SLIDE_PX,
  SCROLL_FADE_THRESHOLD,
  SCROLL_FADE_ROOT_MARGIN,
  STAGGER_DELAY_MS,
  STAGGER_MAX_DELAY_MS,
} from "@/lib/animationConstants";

/**
 * FadeInOnScroll — reusable wrapper that fades + slides its children into
 * view the first time they enter the viewport.
 *
 * @param {{
 *   children: React.ReactNode,
 *   /** Stagger index for grid/list items — each item waits
 *    *  (index * STAGGER_DELAY_MS) ms before starting, capped at
 *    *  STAGGER_MAX_DELAY_MS so long lists don't feel slow. *\/
 *   index?: number,
 *   /** Extra CSS class names forwarded to the wrapper div *\/
 *   className?: string,
 *   /** HTML element tag for the wrapper (default: "div") *\/
 *   as?: keyof JSX.IntrinsicElements,
 * }} props
 *
 * Implementation notes:
 *  - animate-once: `unobserve` is called once the element is visible.
 *  - prefers-reduced-motion: detected via matchMedia; when set the element
 *    is immediately visible with no transition or transform.
 *  - No layout shift: the element still occupies its full dimensions even
 *    while invisible — only opacity and transform change, never width/height.
 *  - Interactive elements inside stay fully clickable immediately because
 *    pointer-events is never modified.
 */
export default function FadeInOnScroll({
  children,
  index = 0,
  className = "",
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    // Detect prefers-reduced-motion on the client
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setPrefersReduced(true);
      return; // No observer needed — show immediately
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            // Animate once — stop observing after first trigger
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: SCROLL_FADE_THRESHOLD,
        rootMargin: SCROLL_FADE_ROOT_MARGIN,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Cap stagger delay so very long lists don't drag
  const staggerDelay = Math.min(index * STAGGER_DELAY_MS, STAGGER_MAX_DELAY_MS);

  // When prefers-reduced-motion is set, render with no animation at all
  if (prefersReduced) {
    return (
      <Tag className={className}>
        {children}
      </Tag>
    );
  }

  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${SCROLL_FADE_SLIDE_PX}px)`,
    transition: visible
      ? `opacity ${SCROLL_FADE_DURATION_MS}ms ease-out ${staggerDelay}ms, transform ${SCROLL_FADE_DURATION_MS}ms ease-out ${staggerDelay}ms`
      : "none",
    // Preserve element's block layout so nothing reflows on reveal
    willChange: visible ? "auto" : "opacity, transform",
  };

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
