"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useAgentAuth } from "@/context/AgentAuthContext";

const navLinks = [
  { label: "Home",       href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Hotels",     href: "/hotels" },
  { label: "About",      href: "/about" },
  { label: "Contact",    href: "/contact" },
];

export default function Header() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { agent, logout } = useAgentAuth();

  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    startTransition(() => {
      setMenuOpen(false);
      setDropdownOpen(false);
    });
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href) => pathname === href;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  // Hide header on dashboard pages (own shell) and auth pages (clean layout)
  const hideOnRoutes = ["/agent/dashboard", "/login", "/register", "/agent/login", "/agent/register"];
  if (hideOnRoutes.some((r) => pathname.startsWith(r))) return null;

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
              aria-label="Elgaa Real Estate — home"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)] font-bold text-[var(--color-text-inverse)] text-sm tracking-wide"
                aria-hidden="true"
              >
                EG
              </span>
              <span className="text-[var(--color-text-primary)] font-semibold text-lg tracking-tight">
                Elgaa<span className="text-[var(--color-brand)]"> Real Estate</span>
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

              {agent ? (
                /* ── Agent is logged in: show avatar + dropdown ── */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    aria-label="Agent menu"
                    className="flex items-center gap-2.5 h-9 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-brand)]/50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="relative h-6 w-6 rounded-full overflow-hidden bg-[var(--color-brand)]/20 shrink-0">
                      {agent.avatar ? (
                        <Image src={agent.avatar} alt={agent.name} fill className="object-cover" sizes="24px" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-[var(--color-brand)]">
                          {agent.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-[var(--color-text-primary)] max-w-[100px] truncate">
                      {agent.name?.split(" ")[0]}
                    </span>
                    <ChevronDownIcon className={dropdownOpen ? "rotate-180" : ""} />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-0)] shadow-xl shadow-black/30 overflow-hidden z-50">
                      {/* Agent info */}
                      <div className="px-4 py-3 border-b border-[var(--color-border)]">
                        <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{agent.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)] truncate">{agent.email}</p>
                        <div className="mt-1 inline-flex items-center gap-1 bg-[var(--color-brand)]/10 rounded-full px-2 py-0.5">
                          <span className="text-[10px] font-semibold text-[var(--color-brand)] uppercase tracking-wide">Agent</span>
                        </div>
                      </div>
                      {/* Links */}
                      <div className="py-1">
                        <DropdownLink href="/agent/dashboard" icon={<GridIcon />} label="Dashboard" onClick={() => setDropdownOpen(false)} />
                        <DropdownLink href="/agent/dashboard/listings" icon={<BuildingIcon />} label="My Listings" onClick={() => setDropdownOpen(false)} />
                        <DropdownLink href={`/agents/${agent.id}`} icon={<UserIcon />} label="Public Profile" onClick={() => setDropdownOpen(false)} />
                        <DropdownLink href="/agent/dashboard/profile" icon={<EditIcon />} label="Edit Profile" onClick={() => setDropdownOpen(false)} />
                      </div>
                      <div className="border-t border-[var(--color-border)] py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-400/5 transition-colors"
                        >
                          <LogOutIcon /> Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Not logged in: show Sign in as Agent button ── */
                <Button variant="outline" size="sm" href="/agent/login">
                  <AgentIcon />
                  Sign in as Agent
                </Button>
              )}
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

            {agent ? (
              /* Agent logged in — mobile */
              <>
                <div className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-[var(--color-brand)]/20 shrink-0">
                    {agent.avatar ? (
                      <Image src={agent.avatar} alt={agent.name} fill className="object-cover" sizes="32px" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs font-bold text-[var(--color-brand)]">
                        {agent.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{agent.name}</p>
                    <p className="text-xs text-[var(--color-brand)]">Agent</p>
                  </div>
                </div>
                <Button variant="secondary" href="/agent/dashboard" className="w-full justify-center">
                  <GridIcon /> Dashboard
                </Button>
                <button
                  onClick={handleLogout}
                  className="w-full h-11 px-4 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-red-400 hover:border-red-400/20 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              /* Not logged in — mobile */
              <Button variant="primary" href="/agent/login" className="w-full justify-center">
                <AgentIcon /> Sign in as Agent
              </Button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function DropdownLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)] transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HeartIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function AgentIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function ChevronDownIcon({ className = "" }) {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`transition-transform duration-200 ${className}`}><polyline points="6 9 12 15 18 9"/></svg>;
}
function GridIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function BuildingIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>;
}
function UserIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function EditIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
function LogOutIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}
