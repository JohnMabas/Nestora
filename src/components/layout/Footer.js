"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

const footerLinks = {
  Properties: [
    { label: "For Sale",        href: "/properties?listingType=sale" },
    { label: "For Rent",        href: "/properties?listingType=rent" },
    { label: "Short Let",       href: "/properties?listingType=short-let" },
    { label: "New Developments", href: "/properties?type=new" },
    { label: "Luxury Homes",    href: "/properties?type=villa" },
  ],
  Hotels: [
    { label: "Jos",             href: "/hotels?destination=jos" },
    { label: "Abuja",           href: "/hotels?destination=abuja" },
    { label: "Jos Plateau",     href: "/hotels?destination=plateau" },
    { label: "Boutique Hotels", href: "/hotels?type=boutique" },
    { label: "Resorts",         href: "/hotels?type=resort" },
  ],
  Company: [
    { label: "About Us",        href: "/about" },
    { label: "Our Agents",      href: "/agents" },
    { label: "Testimonials",    href: "/#testimonials" },
    { label: "Blog",            href: "/blog" },
    { label: "Careers",         href: "/careers" },
  ],
  Support: [
    { label: "Contact",         href: "/contact" },
    { label: "Help Centre",     href: "/help" },
    { label: "Privacy Policy",  href: "/privacy" },
    { label: "Terms of Service",href: "/terms" },
    { label: "Cookie Policy",   href: "/cookies" },
  ],
};

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard pages (own shell) and auth pages (clean layout)
  const hideOnRoutes = ["/agent/dashboard", "/login", "/register", "/agent/login", "/agent/register"];
  if (hideOnRoutes.some((r) => pathname.startsWith(r))) return null;

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-0)]" role="contentinfo">
      {/* Main footer */}
      <Container className="py-16">
        <FadeInOnScroll>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit" aria-label="Elgaa Real Estate — home">
              <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)] font-bold text-[var(--color-text-inverse)] text-sm tracking-wide">
                EG
              </span>
              <span className="text-[var(--color-text-primary)] font-semibold text-lg tracking-tight">
                Elgaa<span className="text-[var(--color-brand)]"> Real Estate</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] max-w-xs">
              Nigeria&apos;s premier real-estate and hotel discovery platform serving Jos Plateau and Abuja. Find your perfect property or ideal hotel stay — all in one place.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
              <span>hello@elgaa.ng</span>
              <span>+234 700 ELGAA (35422)</span>
              <span>Jos, Plateau State · Maitama, Abuja</span>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] tracking-wide">
                {heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        </FadeInOnScroll>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-border)]">
        <Container className="flex flex-col gap-3 py-6 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Elgaa Real Estate. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[var(--color-brand)] transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-[var(--color-brand)] transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-[var(--color-brand)] transition-colors">Cookies</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];
