"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

/**
 * AgentContactForm — sends a mock lead inquiry from the public agent profile page.
 * TODO: replace the mock submission with POST /api/leads when backend is ready.
 */
export default function AgentContactForm({ agentId, agentName, propertyId = null }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");

    // TODO: replace with POST /api/leads
    await new Promise((r) => setTimeout(r, 700));

    // Persist to localStorage so the agent dashboard can show it
    try {
      const storeKey = `elgaa_agent_store_${agentId}`;
      const raw = localStorage.getItem(storeKey);
      const store = raw ? JSON.parse(raw) : { leads: [], appointments: [], listingMutations: {} };
      store.leads = [
        {
          id: `lead-${Date.now()}`,
          agentId,
          propertyId,
          hotelId: null,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          status: "new",
          createdAt: new Date().toISOString(),
        },
        ...(store.leads || []),
      ];
      localStorage.setItem(storeKey, JSON.stringify(store));
    } catch { /* ignore */ }

    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5 text-center space-y-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand)]/10 mb-2">
          <CheckIcon />
        </div>
        <p className="font-semibold text-[var(--color-text-primary)] text-sm">Message sent!</p>
        <p className="text-xs text-[var(--color-text-muted)]">{agentName} will be in touch shortly.</p>
        <button
          onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", message: "" }); }}
          className="text-xs text-[var(--color-brand)] hover:underline mt-1"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
      <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Send a message</h2>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <input
          type="text"
          required
          placeholder="Your name"
          value={form.name}
          onChange={set("name")}
          className="input-base"
          aria-label="Your name"
        />
        <input
          type="email"
          required
          placeholder="Email address"
          value={form.email}
          onChange={set("email")}
          className="input-base"
          aria-label="Email address"
        />
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={set("phone")}
          className="input-base"
          aria-label="Phone number"
        />
        <textarea
          required
          placeholder={`Message to ${agentName}…`}
          value={form.message}
          onChange={set("message")}
          rows={4}
          className="input-base resize-none"
          aria-label="Your message"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-center"
          disabled={status === "loading"}
        >
          {status === "loading" ? <><Spinner /> Sending…</> : "Send Message"}
        </Button>
      </form>
    </div>
  );
}

function CheckIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>;
}
function Spinner() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
}
