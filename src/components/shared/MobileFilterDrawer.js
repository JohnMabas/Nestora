"use client";

import { useEffect, useRef } from "react";

/**
 * Generic mobile filter drawer / bottom sheet.
 * Renders children inside a slide-up panel with overlay.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   title?: string,
 *   children: React.ReactNode,
 * }} props
 */
export default function MobileFilterDrawer({ open, onClose, title = "Filters", children }) {
  const drawerRef = useRef(null);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Focus trap — return focus to first focusable child when opening
  useEffect(() => {
    if (open && drawerRef.current) {
      const first = drawerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-surface-0)]/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className="relative z-10 max-h-[85dvh] flex flex-col rounded-t-[var(--radius-2xl)] border-t border-[var(--color-border)] bg-[var(--color-surface-2)] shadow-2xl"
        role="document"
      >
        {/* Handle bar */}
        <div className="flex items-center justify-center pt-3 pb-2" aria-hidden="true">
          <div className="h-1 w-10 rounded-full bg-[var(--color-surface-4)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-[var(--color-border)]">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
