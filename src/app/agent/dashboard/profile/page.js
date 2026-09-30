"use client";

import { useState } from "react";
import Image from "next/image";
import { useAgentAuth } from "@/context/AgentAuthContext";
import Button from "@/components/ui/Button";

const SPECIALIZATION_OPTIONS = [
  "Luxury Homes", "Investment Properties", "Residential Rentals",
  "Commercial Real Estate", "Gated Estates", "First-Time Buyers",
  "Diplomatic Residences", "Waterfront", "Off-Plan",
];

const LANGUAGE_OPTIONS = ["English", "Hausa", "Igbo", "Yoruba", "French", "Arabic", "Fulani"];

export default function ProfilePage() {
  const { agent, updateAgent } = useAgentAuth();

  const [form, setForm] = useState({
    name:            agent?.name          ?? "",
    phone:           agent?.phone         ?? "",
    avatar:          agent?.avatar        ?? "",
    agencyName:      agent?.agencyName    ?? "",
    licenseNumber:   agent?.licenseNumber ?? "",
    title:           agent?.title         ?? "",
    bio:             agent?.bio           ?? "",
    yearsExperience: agent?.yearsExperience ?? 0,
    languages:       agent?.languages     ?? ["English"],
    specializations: agent?.specializations ?? [],
    areasServed:     (agent?.areasServed ?? []).join(", "),
    responseTime:    agent?.responseTime  ?? "",
    socialLinkedIn:  agent?.socialLinks?.linkedin   ?? "",
    socialInstagram: agent?.socialLinks?.instagram  ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const set = (key) => (e) => {
    setSaved(false);
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const toggleItem = (key, value) =>
    setForm((p) => ({
      ...p,
      [key]: p[key].includes(value) ? p[key].filter((v) => v !== value) : [...p[key], value],
    }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    // TODO: replace with PATCH /api/agents/:id
    updateAgent({
      name:            form.name,
      phone:           form.phone,
      avatar:          form.avatar,
      agencyName:      form.agencyName,
      licenseNumber:   form.licenseNumber,
      title:           form.title,
      bio:             form.bio,
      yearsExperience: Number(form.yearsExperience),
      languages:       form.languages,
      specializations: form.specializations,
      areasServed:     form.areasServed.split(",").map((s) => s.trim()).filter(Boolean),
      responseTime:    form.responseTime,
      socialLinks: {
        linkedin:  form.socialLinkedIn  || null,
        instagram: form.socialInstagram || null,
      },
    });

    setSaving(false);
    setSaved(true);
  };

  return (
    <form onSubmit={handleSave} className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">Edit Profile</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Changes are reflected on your public profile at{" "}
            <a href={`/agents/${agent?.id}`} target="_blank" className="text-[var(--color-brand)] hover:underline">
              /agents/{agent?.id}
            </a>
          </p>
        </div>
        <Button type="submit" variant="primary" size="sm" disabled={saving}>
          {saving ? <><Spinner /> Saving…</> : saved ? "✓ Saved" : "Save changes"}
        </Button>
      </div>

      {/* Success banner */}
      {saved && (
        <div className="rounded-[var(--radius-md)] border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          ✓ Profile updated successfully.
        </div>
      )}

      {/* Avatar */}
      <Section title="Profile Photo">
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden border-2 border-[var(--color-brand)]/30 bg-[var(--color-surface-3)]">
            {form.avatar ? (
              <Image src={form.avatar} alt={form.name} fill className="object-cover" sizes="80px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--color-brand)]">
                {form.name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide block mb-1.5">
              Photo URL
            </label>
            <input
              type="url"
              value={form.avatar}
              onChange={set("avatar")}
              placeholder="https://example.com/photo.jpg"
              className="input-base"
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Paste any public image URL. File upload coming with backend.</p>
          </div>
        </div>
      </Section>

      {/* Personal info */}
      <Section title="Personal Information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full name" required>
            <input type="text" required value={form.name} onChange={set("name")} className="input-base" />
          </Field>
          <Field label="Job title">
            <input type="text" value={form.title} onChange={set("title")} placeholder="Senior Real Estate Agent" className="input-base" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone">
            <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+234 800 000 0000" className="input-base" />
          </Field>
          <Field label="Years of experience">
            <input type="number" min="0" max="50" value={form.yearsExperience} onChange={set("yearsExperience")} className="input-base" />
          </Field>
        </div>
        <Field label="Bio / About">
          <textarea value={form.bio} onChange={set("bio")} rows={4} placeholder="Tell buyers about yourself and your expertise…" className="input-base resize-none" />
        </Field>
        <Field label="Typical response time">
          <input type="text" value={form.responseTime} onChange={set("responseTime")} placeholder="Usually responds within 1 hour" className="input-base" />
        </Field>
      </Section>

      {/* Agency */}
      <Section title="Agency & Credentials">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Agency / Brokerage">
            <input type="text" value={form.agencyName} onChange={set("agencyName")} className="input-base" />
          </Field>
          <Field label="License number">
            <input type="text" value={form.licenseNumber} onChange={set("licenseNumber")} className="input-base" />
          </Field>
        </div>
      </Section>

      {/* Languages */}
      <Section title="Languages">
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => {
            const selected = form.languages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleItem("languages", lang)}
                className={[
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  selected
                    ? "bg-[var(--color-brand)]/10 border-[var(--color-brand)]/40 text-[var(--color-brand)]"
                    : "bg-[var(--color-surface-3)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                ].join(" ")}
              >
                {selected ? "✓ " : ""}{lang}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Specializations */}
      <Section title="Specializations">
        <div className="flex flex-wrap gap-2">
          {SPECIALIZATION_OPTIONS.map((spec) => {
            const selected = form.specializations.includes(spec);
            return (
              <button
                key={spec}
                type="button"
                onClick={() => toggleItem("specializations", spec)}
                className={[
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  selected
                    ? "bg-[var(--color-brand)]/10 border-[var(--color-brand)]/40 text-[var(--color-brand)]"
                    : "bg-[var(--color-surface-3)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                ].join(" ")}
              >
                {selected ? "✓ " : ""}{spec}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Areas served */}
      <Section title="Areas Served">
        <Field label="Areas (comma-separated)">
          <input
            type="text"
            value={form.areasServed}
            onChange={set("areasServed")}
            placeholder="Jos, Rayfield, GRA, Maitama"
            className="input-base"
          />
        </Field>
      </Section>

      {/* Social links */}
      <Section title="Social Links">
        <Field label="LinkedIn URL">
          <input type="url" value={form.socialLinkedIn} onChange={set("socialLinkedIn")} placeholder="https://linkedin.com/in/yourname" className="input-base" />
        </Field>
        <Field label="Instagram URL">
          <input type="url" value={form.socialInstagram} onChange={set("socialInstagram")} placeholder="https://instagram.com/yourhandle" className="input-base" />
        </Field>
      </Section>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary" size="md" disabled={saving}>
          {saving ? <><Spinner /> Saving…</> : saved ? "✓ Saved" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5 space-y-4">
      <h2 className="text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
        {label}{required && <span className="text-[var(--color-brand)] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Spinner() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
}
