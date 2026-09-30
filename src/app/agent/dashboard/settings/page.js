"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    newLeadEmail:        true,
    newAppointmentEmail: true,
    weeklyDigest:        false,
    marketingEmails:     false,
  });
  const [pwSaving, setPwSaving]         = useState(false);
  const [pwSaved,  setPwSaved]          = useState(false);
  const [pwError,  setPwError]          = useState("");
  const [showDeactivate, setShowDeactivate] = useState(false);

  const setNotif = (key) => (e) =>
    setNotifications((p) => ({ ...p, [key]: e.target.checked }));

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwError("");
    if (passwords.newPw.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (passwords.newPw !== passwords.confirm) {
      setPwError("Passwords do not match.");
      return;
    }
    setPwSaving(true);
    // TODO: replace with PATCH /api/auth/password
    await new Promise((r) => setTimeout(r, 700));
    setPwSaving(false);
    setPwSaved(true);
    setPasswords({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Manage your account and notification preferences.</p>
      </div>

      {/* ── Change password ───────────────────────────── */}
      <Section title="Change Password">
        <p className="text-xs text-[var(--color-text-muted)] -mt-2">
          Password changes are mock-only in this phase. No real credentials are stored or modified.
        </p>

        {pwError && (
          <div role="alert" className="rounded-[var(--radius-md)] border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
            {pwError}
          </div>
        )}
        {pwSaved && (
          <div className="rounded-[var(--radius-md)] border border-green-500/30 bg-green-500/10 px-3 py-2.5 text-sm text-green-400">
            ✓ Password updated (mock).
          </div>
        )}

        <form onSubmit={handlePwSubmit} className="space-y-4">
          <Field label="Current password">
            <input
              type="password"
              autoComplete="current-password"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              placeholder="••••••••"
              className="input-base"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="New password">
              <input
                type="password"
                autoComplete="new-password"
                value={passwords.newPw}
                onChange={(e) => setPasswords((p) => ({ ...p, newPw: e.target.value }))}
                placeholder="Min. 6 characters"
                className="input-base"
              />
            </Field>
            <Field label="Confirm new password">
              <input
                type="password"
                autoComplete="new-password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat password"
                className="input-base"
              />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="secondary" size="sm" disabled={pwSaving}>
              {pwSaving ? <><Spinner /> Updating…</> : "Update password"}
            </Button>
          </div>
        </form>
      </Section>

      {/* ── Notification preferences ──────────────────── */}
      <Section title="Notification Preferences">
        <p className="text-xs text-[var(--color-text-muted)] -mt-2">
          Toggles only — email notifications will be functional when a backend is connected.
        </p>
        <div className="space-y-3">
          <NotifToggle
            label="New lead notification"
            description="Email me when a buyer sends an inquiry"
            checked={notifications.newLeadEmail}
            onChange={setNotif("newLeadEmail")}
          />
          <NotifToggle
            label="New appointment notification"
            description="Email me when a viewing is scheduled"
            checked={notifications.newAppointmentEmail}
            onChange={setNotif("newAppointmentEmail")}
          />
          <NotifToggle
            label="Weekly digest"
            description="Summary of your listings performance every Monday"
            checked={notifications.weeklyDigest}
            onChange={setNotif("weeklyDigest")}
          />
          <NotifToggle
            label="Marketing emails"
            description="Tips, product updates, and feature announcements"
            checked={notifications.marketingEmails}
            onChange={setNotif("marketingEmails")}
          />
        </div>
      </Section>

      {/* ── Account deactivation ──────────────────────── */}
      <Section title="Account" danger>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Deactivating your account will remove your public profile and hide all your listings. This is a placeholder — no real action is taken in the mock phase.
        </p>
        {!showDeactivate ? (
          <button
            type="button"
            onClick={() => setShowDeactivate(true)}
            className="mt-2 px-4 py-2 rounded-[var(--radius-md)] border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/5 transition-colors"
          >
            Deactivate account
          </button>
        ) : (
          <div className="mt-3 rounded-[var(--radius-md)] border border-red-500/30 bg-red-500/5 p-4 space-y-3">
            <p className="text-sm text-red-400 font-medium">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeactivate(false)}
                className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-surface-3)] border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Keep account
              </button>
              <button
                type="button"
                onClick={() => { alert("Account deactivation is not functional in the mock phase."); setShowDeactivate(false); }}
                className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Yes, deactivate
              </button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children, danger = false }) {
  return (
    <div className={[
      "rounded-[var(--radius-xl)] border bg-[var(--color-surface-2)] p-5 space-y-4",
      danger ? "border-red-500/20" : "border-[var(--color-border)]",
    ].join(" ")}>
      <h2 className={["text-sm font-semibold border-b pb-3", danger ? "text-red-400 border-red-500/20" : "text-[var(--color-text-primary)] border-[var(--color-border)]"].join(" ")}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function NotifToggle({ label, description, checked, onChange }) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{description}</p>
      </div>
      <div className="relative shrink-0 mt-0.5">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div
          className={[
            "w-10 h-5 rounded-full transition-colors duration-200",
            checked ? "bg-[var(--color-brand)]" : "bg-[var(--color-surface-4)]",
          ].join(" ")}
        />
        <div
          className={[
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
      </div>
    </label>
  );
}

function Spinner() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
}
