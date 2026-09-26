"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Home",       href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Hotels",     href: "/hotels" },
  { label: "About",      href: "/about" },
  { label: "Contact",    href: "/contact" },
];

export default function Header() {
  const pathname  = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href) => pathname === href;

  return (
    <>
      <header
        role="banner"
        className={[
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[var(--color-surface-0)]/95 backdrop-blur-md border-b border-[var(--color-border)] py-3"
            : "bg-transparent py-5",
        ].join(" ")}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 focus-visible:outline-none group"
              aria-label="EstateOne — home"
            >
              {/* Simple wordmark logo */}
              <span
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)] font-bold text-[var(--color-text-inverse)] text-sm tracking-wide"
                aria-hidden="true"
              >
                E1
              </span>
              <span className="text-[var(--color-text-primary)] font-semibold text-lg tracking-tight">
                Estate<span className="text-[var(--color-brand)]">One</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "relative px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] transition-colors duration-200",
                    isActive(link.href)
                      ? "text-[var(--color-brand)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                  ].join(" ")}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[var(--color-brand)]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" href="/favorites" aria-label="Saved properties">
                <HeartIcon />
                Saved
              </Button>
              <Button variant="primary" size="sm" href="/contact">
                List Property
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)] transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className={["block w-5 h-0.5 bg-current transition-all duration-200", menuOpen ? "rotate-45 translate-y-2" : ""].join(" ")} />
              <span className={["block w-5 h-0.5 bg-current transition-all duration-200", menuOpen ? "opacity-0" : ""].join(" ")} />
              <span className={["block w-5 h-0.5 bg-current transition-all duration-200", menuOpen ? "-rotate-45 -translate-y-2" : ""].join(" ")} />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={[
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        {/* Backdrop */}
        <div
          className={["absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300", menuOpen ? "opacity-100" : "opacity-0"].join(" ")}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
        {/* Panel */}
        <nav
          aria-label="Mobile navigation"
          className={[
            "absolute top-0 right-0 h-full w-72 bg-[var(--color-surface-0)] border-l border-[var(--color-border)] flex flex-col pt-20 px-6 pb-8 transition-transform duration-300",
            menuOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={[
                    "flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]",
                  ].join(" ")}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <Button variant="secondary" href="/favorites" className="w-full justify-center">
              <HeartIcon /> Saved
            </Button>
            <Button variant="primary" href="/contact" className="w-full justify-center">
              List Property
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}

function HeartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
