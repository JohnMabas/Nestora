/**
 * Animation constants — all timing values in one place.
 * Adjust these to tune every animation across the app.
 */

// ─── Hero content fade-in (on page load) ──────────────────────────────────
/** Duration of the hero content fade-in + slide-up, in ms */
export const HERO_FADE_DURATION_MS = 700;

/** Y-offset (px) the hero content starts from, slides up to 0 */
export const HERO_FADE_SLIDE_PX = 16;

/** Delay before hero content starts fading in, in ms */
export const HERO_FADE_DELAY_MS = 100;

// ─── Hero background cross-fade ───────────────────────────────────────────
/** How long each hero background image is shown before switching, in ms */
export const HERO_BG_INTERVAL_MS = 3000;

/** Duration of the opacity cross-fade between hero background images, in ms */
export const HERO_BG_TRANSITION_MS = 1000;

// ─── Scroll-triggered fade-in ─────────────────────────────────────────────
/** Duration of each scroll-triggered fade-in + slide-up, in ms */
export const SCROLL_FADE_DURATION_MS = 600;

/** Y-offset (px) elements start from when scroll-fading in */
export const SCROLL_FADE_SLIDE_PX = 20;

/** IntersectionObserver threshold — fraction of element visible to trigger */
export const SCROLL_FADE_THRESHOLD = 0.15;

/** Root margin for IntersectionObserver (negative = earlier trigger) */
export const SCROLL_FADE_ROOT_MARGIN = "0px 0px -40px 0px";

// ─── Stagger for grid/list items ─────────────────────────────────────────
/** Delay added per sibling index for staggered grid items, in ms */
export const STAGGER_DELAY_MS = 50;

/** Maximum stagger delay cap — prevents long lists from feeling slow, in ms */
export const STAGGER_MAX_DELAY_MS = 300;
