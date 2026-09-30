"use client";

import Link from "next/link";
import { useAgentAuth } from "@/context/AgentAuthContext";
import { useAgentStore } from "@/context/AgentStoreContext";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const { agent } = useAgentAuth();
  const { leads, appointments, getAgentListings } = useAgentStore();

  const listings = getAgentListings().filter((l) => l._action !== "delete");
  const activeListings = listings.filter((l) => !l.status || l.status === "active").length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const upcomingAppts = appointments.filter(
    (a) => (a.status === "confirmed" || a.status === "pending") && new Date(a.dateTime) > new Date()
  ).length;
  const recentLeads = leads.slice(0, 4);
  const recentListings = listings.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Welcome back, {agent?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Here&apos;s what&apos;s happening with your listings and leads today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BuildingIcon />} label="Active listings" value={activeListings} href="/agent/dashboard/listings" />
        <StatCard icon={<EyeIcon />}     label="Total views"    value="2,841" note="mock" />
        <StatCard icon={<MessageIcon />} label="New leads"      value={newLeads} href="/agent/dashboard/leads" accent={newLeads > 0} />
        <StatCard icon={<CalendarIcon />} label="Appointments"  value={upcomingAppts} href="/agent/dashboard/appointments" />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button href="/agent/dashboard/listings/new" variant="primary" size="sm">
          <PlusIcon /> Add New Listing
        </Button>
        <Button href="/agent/dashboard/leads" variant="secondary" size="sm">
          <MessageIcon /> View Leads
        </Button>
        <Button href={`/agents/${agent?.id}`} variant="ghost" size="sm">
          <ExternalLinkIcon /> My Public Profile
        </Button>
      </div>

      {/* Two-column bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <section aria-labelledby="recent-leads-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="recent-leads-heading" className="text-base font-semibold text-[var(--color-text-primary)]">
              Recent Leads
            </h2>
            <Link href="/agent/dashboard/leads" className="text-xs text-[var(--color-brand)] hover:underline">View all</Link>
          </div>
          {recentLeads.length > 0 ? (
            <ul className="space-y-2">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-brand)]">
                    {lead.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{lead.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{lead.message?.slice(0, 55)}…</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyCard message="No leads yet. They'll appear here when buyers contact you." />
          )}
        </section>

        {/* Recent listings */}
        <section aria-labelledby="recent-listings-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="recent-listings-heading" className="text-base font-semibold text-[var(--color-text-primary)]">
              Your Listings
            </h2>
            <Link href="/agent/dashboard/listings" className="text-xs text-[var(--color-brand)] hover:underline">Manage</Link>
          </div>
          {recentListings.length > 0 ? (
            <ul className="space-y-2">
              {recentListings.map((listing) => (
                <li key={listing.id} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
                  <div className="h-10 w-10 shrink-0 rounded-[var(--radius-sm)] bg-[var(--color-surface-3)] overflow-hidden">
                    {listing.images?.[0]?.src && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={listing.images[0].src} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{listing.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{listing.location?.city}</p>
                  </div>
                  <Link href={`/agent/dashboard/listings/${listing.id}/edit`} className="text-xs text-[var(--color-brand)] hover:underline shrink-0">
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyCard message="No listings yet." />
          )}
        </section>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, href, note, accent = false }) {
  const content = (
    <div className={[
      "rounded-[var(--radius-xl)] border bg-[var(--color-surface-2)] p-5 transition-colors",
      accent ? "border-[var(--color-brand)]/40 bg-[var(--color-brand)]/5" : "border-[var(--color-border)]",
      href ? "hover:border-[var(--color-brand)]/50 cursor-pointer" : "",
    ].join(" ")}>
      <div className={["mb-3", accent ? "text-[var(--color-brand)]" : "text-[var(--color-text-muted)]"].join(" ")}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">{value}</p>
      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
        {label}{note && <span className="ml-1 italic">({note})</span>}
      </p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function StatusBadge({ status }) {
  const map = {
    new:       "bg-blue-500/10 text-blue-400 border-blue-500/20",
    contacted: "bg-[var(--color-brand)]/10 text-[var(--color-brand)] border-[var(--color-brand)]/20",
    closed:    "bg-[var(--color-surface-4)] text-[var(--color-text-muted)] border-[var(--color-border)]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${map[status] ?? map.new}`}>
      {status}
    </span>
  );
}

function EmptyCard({ message }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-center">
      <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function BuildingIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>; }
function EyeIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
function MessageIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function CalendarIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function ExternalLinkIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>; }
