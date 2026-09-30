"use client";

import { useState } from "react";
import Link from "next/link";
import { useAgentStore } from "@/context/AgentStoreContext";
import Button from "@/components/ui/Button";

const STATUS_FILTERS = ["all", "active", "pending", "sold", "rented"];

const STATUS_STYLES = {
  active:  "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  sold:    "bg-[var(--color-brand)]/10 text-[var(--color-brand)] border-[var(--color-brand)]/20",
  rented:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function ListingsPage() {
  const { getAgentListings, deleteListing } = useAgentStore();
  const [filter, setFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null); // id to confirm delete

  const allListings = getAgentListings().filter((l) => l._action !== "delete");
  const listings = filter === "all"
    ? allListings
    : allListings.filter((l) => (l.status || "active") === filter);

  const formatPrice = (amount, currency = "NGN") => {
    if (!amount) return "—";
    if (currency === "NGN") {
      if (amount >= 1_000_000_000) return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
      if (amount >= 1_000_000)     return `₦${(amount / 1_000_000).toFixed(1)}M`;
    }
    return `₦${Number(amount).toLocaleString()}`;
  };

  const handleDelete = (id) => {
    deleteListing(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">Listings</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{allListings.length} total listings</p>
        </div>
        <Button href="/agent/dashboard/listings/new" variant="primary" size="sm">
          <PlusIcon /> Add New Listing
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {STATUS_FILTERS.map((s) => (
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
            {s}
          </button>
        ))}
      </div>

      {/* Listings table */}
      {listings.length > 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-3)]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Property</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide hidden sm:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide hidden md:table-cell">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide hidden lg:table-cell">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-[var(--color-surface-3)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 shrink-0 rounded-[var(--radius-sm)] bg-[var(--color-surface-4)] overflow-hidden">
                          {listing.images?.[0]?.src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={listing.images[0].src} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[var(--color-text-muted)]">
                              <ImageIcon />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--color-text-primary)] truncate max-w-[180px]">{listing.title}</p>
                          <p className="text-xs text-[var(--color-text-muted)] truncate">{listing.location?.city}, {listing.location?.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${STATUS_STYLES[listing.status || "active"] ?? STATUS_STYLES.active}`}>
                        {listing.status || "active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[var(--color-text-primary)] font-medium">
                        {formatPrice(listing.price, listing.currency)}
                        {listing.pricePeriod && <span className="text-[var(--color-text-muted)] font-normal">{listing.pricePeriod}</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-[var(--color-text-secondary)] capitalize">{listing.listingType} · {listing.propertyType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/properties/${listing.slug}`}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                          title="View listing"
                        >
                          <EyeIcon />
                        </Link>
                        <Link
                          href={`/agent/dashboard/listings/${listing.id}/edit`}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                          title="Edit listing"
                        >
                          <EditIcon />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(listing.id)}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                          title="Delete listing"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-16 text-center space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface-3)] text-[var(--color-text-muted)]">
            <BuildingIcon />
          </div>
          <p className="text-[var(--color-text-secondary)]">No listings found.</p>
          <Button href="/agent/dashboard/listings/new" variant="primary" size="sm">
            <PlusIcon /> Add your first listing
          </Button>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface-0)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">Delete listing?</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-5">
              This will remove the listing from your dashboard. This action only affects your session — shared mock data is not modified.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" className="flex-1 justify-center" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 h-8 px-4 rounded-[var(--radius-sm)] bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function BuildingIcon() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>; }
function EyeIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
function EditIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function TrashIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
function ImageIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
