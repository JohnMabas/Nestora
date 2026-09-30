"use client";

import { useState } from "react";
import { useAgentStore } from "@/context/AgentStoreContext";
import { properties } from "@/lib/data/properties";

const STATUS_FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];
const STATUS_STYLES = {
  pending:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
  completed: "bg-[var(--color-brand)]/10 text-[var(--color-brand)] border-[var(--color-brand)]/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AppointmentsPage() {
  const { appointments, updateAppointment, addAppointment } = useAgentStore();
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    buyerName: "", buyerContact: "", propertyId: "", dateTime: "",
  });

  const filtered =
    filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  const upcoming = [...filtered].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const getPropertyTitle = (id) => {
    if (!id) return "—";
    const p = properties.find((p) => p.id === id || p.slug === id);
    return p?.title ?? id;
  };

  const formatDateTime = (iso) =>
    new Date(iso).toLocaleString("en-GB", {
      weekday: "short", day: "numeric", month: "short",
      year: "numeric", hour: "2-digit", minute: "2-digit",
    });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.buyerName || !form.dateTime) return;
    addAppointment({ ...form, agentId: null });
    setForm({ buyerName: "", buyerContact: "", propertyId: "", dateTime: "" });
    setShowAdd(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">Appointments</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Scheduled property viewings</p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius-md)] bg-[var(--color-brand)] text-[var(--color-text-inverse)] text-sm font-medium hover:bg-[var(--color-brand-light)] transition-colors"
        >
          <PlusIcon /> New appointment
        </button>
      </div>

      {/* Add appointment form */}
      {showAdd && (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-brand)]/30 bg-[var(--color-surface-2)] p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Schedule a Viewing</h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Buyer name *</label>
              <input type="text" required value={form.buyerName} onChange={(e) => setForm((p) => ({ ...p, buyerName: e.target.value }))} placeholder="John Adeyemi" className="input-base" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Buyer contact</label>
              <input type="text" value={form.buyerContact} onChange={(e) => setForm((p) => ({ ...p, buyerContact: e.target.value }))} placeholder="email or phone" className="input-base" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Property</label>
              <select value={form.propertyId} onChange={(e) => setForm((p) => ({ ...p, propertyId: e.target.value }))} className="input-base">
                <option value="">Select a property…</option>
                {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Date & Time *</label>
              <input type="datetime-local" required value={form.dateTime} onChange={(e) => setForm((p) => ({ ...p, dateTime: e.target.value }))} className="input-base" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="h-9 px-4 rounded-[var(--radius-md)] bg-[var(--color-brand)] text-[var(--color-text-inverse)] text-sm font-medium hover:bg-[var(--color-brand-light)] transition-colors">
                Save appointment
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="h-9 px-4 rounded-[var(--radius-md)] bg-[var(--color-surface-3)] border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {STATUS_FILTERS.map((s) => {
          const count = s === "all" ? appointments.length : appointments.filter((a) => a.status === s).length;
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

      {/* Appointments list */}
      {upcoming.length > 0 ? (
        <ul className="space-y-3">
          {upcoming.map((appt) => {
            const isPast = new Date(appt.dateTime) < new Date();
            return (
              <li key={appt.id} className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Date block */}
                  <div className="shrink-0 w-14 text-center rounded-[var(--radius-md)] bg-[var(--color-surface-3)] border border-[var(--color-border)] py-2">
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {new Date(appt.dateTime).toLocaleDateString("en-GB", { month: "short" })}
                    </p>
                    <p className="text-xl font-bold text-[var(--color-text-primary)] leading-none">
                      {new Date(appt.dateTime).getDate()}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-sm text-[var(--color-text-primary)]">{appt.buyerName}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${STATUS_STYLES[appt.status] ?? STATUS_STYLES.pending}`}>
                        {appt.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">{formatDateTime(appt.dateTime)}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Property: <span className="text-[var(--color-brand)]">{getPropertyTitle(appt.propertyId)}</span>
                    </p>
                    {appt.buyerContact && (
                      <p className="text-xs text-[var(--color-text-muted)]">Contact: {appt.buyerContact}</p>
                    )}
                  </div>

                  {/* Actions */}
                  {!isPast && appt.status !== "cancelled" && appt.status !== "completed" && (
                    <div className="flex items-center gap-2 shrink-0">
                      {appt.status === "pending" && (
                        <button
                          onClick={() => updateAppointment(appt.id, { status: "confirmed" })}
                          className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {appt.status === "confirmed" && (
                        <button
                          onClick={() => updateAppointment(appt.id, { status: "completed" })}
                          className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20 text-[var(--color-brand)] hover:bg-[var(--color-brand)]/20 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => updateAppointment(appt.id, { status: "cancelled" })}
                        className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium bg-[var(--color-surface-3)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-red-400 hover:border-red-400/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-16 text-center space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface-3)] text-[var(--color-text-muted)] mx-auto">
            <CalendarIcon />
          </div>
          <p className="text-[var(--color-text-secondary)]">No appointments scheduled.</p>
          <p className="text-sm text-[var(--color-text-muted)]">Click &ldquo;New appointment&rdquo; to schedule a property viewing.</p>
        </div>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function PlusIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function CalendarIcon() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
