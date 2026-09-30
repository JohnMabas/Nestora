"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAgentAuth } from "@/context/AgentAuthContext";

const navItems = [
  { href: "/agent/dashboard",              label: "Overview",     icon: GridIcon },
  { href: "/agent/dashboard/listings",     label: "Listings",     icon: BuildingIcon },
  { href: "/agent/dashboard/leads",        label: "Leads",        icon: MessageIcon },
  { href: "/agent/dashboard/appointments", label: "Appointments", icon: CalendarIcon },
  { href: "/agent/dashboard/profile",      label: "Profile",      icon: UserIcon },
  { href: "/agent/dashboard/settings",     label: "Settings",     icon: SettingsIcon },
];

// ─── Extracted inner sidebar content ─────────────────────────────────────────
// Defined outside the parent component so the React Compiler does not flag it
// as a component created during render.

function SidebarContent({ agent, collapsed, onNavClick, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Elgaa home">
          <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)] font-bold text-[var(--color-text-inverse)] text-xs tracking-wide shrink-0">
            EG
          </span>
          {!collapsed && (
            <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              Agent <span className="text-[var(--color-brand)]">Portal</span>
            </span>
          )}
        </Link>
      </div>

      {/* Agent info */}
      {agent && (
        <div className={["flex items-center gap-3 px-4 py-4 border-b border-[var(--color-border)]", collapsed ? "justify-center" : ""].join(" ")}>
          <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden border border-[var(--color-border)]">
            {agent.avatar ? (
              <Image src={agent.avatar} alt={agent.name} fill className="object-cover" sizes="36px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[var(--color-brand)]/20 text-sm font-bold text-[var(--color-brand)]">
                {agent.name?.charAt(0)}
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{agent.name}</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">{agent.agencyName}</p>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <SidebarNav collapsed={collapsed} onNavClick={onNavClick} />

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-[var(--color-border)] flex flex-col gap-1">
        <Link
          href="/"
          className={["flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-4)] transition-colors", collapsed ? "justify-center" : ""].join(" ")}
          title={collapsed ? "Public site" : undefined}
        >
          <ExternalLinkIcon />
          {!collapsed && <span>Public site</span>}
        </Link>
        <button
          onClick={onLogout}
          className={["flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-400/5 transition-colors w-full text-left", collapsed ? "justify-center" : ""].join(" ")}
          title={collapsed ? "Log out" : undefined}
        >
          <LogOutIcon />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
}

function SidebarNav({ collapsed, onNavClick }) {
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/agent/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <nav aria-label="Dashboard navigation" className="flex-1 px-3 py-4 overflow-y-auto">
      <ul className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavClick}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-150",
                isActive(href)
                  ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-4)]",
                collapsed ? "justify-center" : "",
              ].join(" ")}
              aria-current={isActive(href) ? "page" : undefined}
              title={collapsed ? label : undefined}
            >
              <Icon className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

export default function DashboardSidebar() {
  const router   = useRouter();
  const { agent, logout } = useAgentAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/agent/login");
  };

  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={[
          "hidden md:flex flex-col shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface-0)] transition-all duration-200 relative",
          collapsed ? "w-16" : "w-56",
        ].join(" ")}
      >
        <SidebarContent
          agent={agent}
          collapsed={collapsed}
          onNavClick={handleNavClick}
          onLogout={handleLogout}
        />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute bottom-32 -right-3 z-10 h-6 w-6 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] shadow-sm transition-colors"
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 bg-[var(--color-surface-0)] border-b border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-brand)] font-bold text-[var(--color-text-inverse)] text-xs">EG</span>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">Agent Portal</span>
        </Link>
        <button
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-[var(--color-surface-0)] border-r border-[var(--color-border)]">
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <CloseIcon />
            </button>
            <SidebarContent
              agent={agent}
              collapsed={false}
              onNavClick={handleNavClick}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}
    </>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function GridIcon({ className = "" }) { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function BuildingIcon({ className = "" }) { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>; }
function MessageIcon({ className = "" }) { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function CalendarIcon({ className = "" }) { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function UserIcon({ className = "" }) { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function SettingsIcon({ className = "" }) { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function LogOutIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function ExternalLinkIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>; }
function MenuIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
function CloseIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function ChevronLeftIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>; }
function ChevronRightIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>; }
