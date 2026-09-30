"use client";

import { useState } from "react";
import { useAgentStore } from "@/context/AgentStoreContext";
import { properties } from "@/lib/data/properties";

const STATUS_FILTERS = ["all", "new", "contacted", "closed"];
const STATUS_STYLES = {
  new:       "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-[var(--color-brand)]/10 text-[var(--color-brand)] border-[var(--color-brand)]/20",
  closed:    "bg-[var(--color-surface-4)] text-[var(--color-text-muted)] border-[var(--color-border)]",
};

export default function LeadsPage() {
  const { leads, updateLead } = useAgentStore();
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const getPropertyTitle = (id) => {
    if (!id) return null;
    const p = properties.find((p) => p.id === id || p.slug === id);
    return p?.title ?? id;
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">Leads</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          Buyer inquiries generated from your listings and public profile.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {STATUS_FILTERS.map((s) => {
          const count = s === "all" ? leads.length : leads.filter((l) => l.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={[
                "px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors",
                filter === s
                  ? "bg-[var(--color-brand)] text-[var(--color-text-inverse)]"
                  : "bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]",
              ].join(" ")}
            >
              {s} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Leads list */}
      {filtered.length > 0 ? (
        <ul className="space-y-3">
          {filtered.map((lead) => (
            <li
              key={lead.id}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-sm font-bold text-[var(--color-brand)]">
                  {lead.name?.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-sm text-[var(--color-text-primary)]">{lead.name}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${STATUS_STYLES[lead.status] ?? STATUS_STYLES.new}`}>
                      {lead.status}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">{formatDate(lead.createdAt)}</span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1"><MailIcon /> {lead.email}</span>
                    {lead.phone && <span className="flex items-center gap-1"><PhoneIcon /> {lead.phone}</span>}
                    {lead.propertyId && (
                      <span className="flex items-center gap-1 text-[var(--color-brand)]">
                        <BuildingIcon /> {getPropertyTitle(lead.propertyId)}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed pt-1">
                    {lead.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {lead.status === "new" && (
                    <button
                      onClick={() => updateLead(lead.id, { status: "contacted" })}
                      className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium bg-[var(--color-brand)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-light)] transition-colors"
                    >
                      Mark contacted
                    </button>
                  )}
                  {lead.status === "contacted" && (
                    <button
                      onClick={() => updateLead(lead.id, { status: "closed" })}
                      className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium bg-[var(--color-surface-3)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      Archive
                    </button>
                  )}
                  {lead.status === "closed" && (
                    <button
                      onClick={() => updateLead(lead.id, { status: "new" })}
                      className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium bg-[var(--color-surface-3)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      Reopen
                    </button>
                  )}
                  <a
                    href={`mailto:${lead.email}`}
                    className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                    title="Send email"
                  >
                    <MailIcon />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-16 text-center space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface-3)] text-[var(--color-text-muted)] mx-auto">
            <InboxIcon />
          </div>
          <p className="text-[var(--color-text-secondary)]">No leads yet.</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Leads appear here when buyers submit a &ldquo;Contact Agent&rdquo; form on any listing or your public profile.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function MailIcon()     { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>; }
function PhoneIcon()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 5.61 5.61l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>; }
function BuildingIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>; }
function InboxIcon()    { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>; }
