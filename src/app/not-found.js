import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Page Not Found — Elgaa Real Estate",
  description: "The page you were looking for could not be found.",
};

const quickLinks = [
  { label: "Browse Properties", href: "/properties", desc: "Find homes for sale, rent, and short let" },
  { label: "Discover Hotels",   href: "/hotels",     desc: "Book premium stays across Nigeria" },
  { label: "About Us",          href: "/about",      desc: "Learn more about Elgaa Real Estate" },
  { label: "Contact",           href: "/contact",    desc: "Speak to one of our agents" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-20">
      <Container>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Large 404 number */}
          <div className="relative mb-6 select-none" aria-hidden="true">
            <span
              className="text-[160px] sm:text-[220px] font-bold leading-none tracking-tighter"
              style={{
                background: "linear-gradient(135deg, var(--color-surface-3) 0%, var(--color-surface-4) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              404
            </span>
            {/* Gold accent dot */}
            <span className="absolute bottom-6 right-0 translate-x-1/2 h-5 w-5 rounded-full bg-[var(--color-brand)]" />
          </div>

          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="accent-line" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
              Page Not Found
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl mb-4">
            We couldn&apos;t find that page
          </h1>

          {/* Body copy */}
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-10 max-w-md">
            The page you&apos;re looking for may have been moved, deleted, or never existed. Let&apos;s get you back on track.
          </p>

          {/* Primary actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            <Button href="/" variant="primary" size="lg">
              <HomeIcon />
              Back to Home
            </Button>
            <Button href="/properties" variant="secondary" size="lg">
              Browse Properties
            </Button>
          </div>

          {/* Quick links grid */}
          <div className="w-full">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-5">
              Or explore these sections
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickLinks.map(({ label, href, desc }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-4 text-left hover:border-[var(--color-brand)]/60 hover:bg-[var(--color-surface-3)] transition-all group"
                  >
                    <div>
                      <p className="font-semibold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">
                        {label}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{desc}</p>
                    </div>
                    <ArrowRight />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] transition-colors shrink-0" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
