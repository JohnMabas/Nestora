"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAgentAuth } from "@/context/AgentAuthContext";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function AgentRegisterPage() {
  const router = useRouter();
  const { register } = useAgentAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    agencyName: "",
    licenseNumber: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.terms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    setLoading(true);
    const result = await register(form);
    setLoading(false);

    if (result.ok) {
      router.push("/agent/dashboard");
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 bg-[var(--color-surface-1)]">
      <Container>
        <div className="mx-auto w-full max-w-lg">
          {/* Card */}
          <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-0)] p-8 shadow-xl shadow-black/20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 mb-8 w-fit" aria-label="Elgaa Real Estate — home">
              <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)] font-bold text-[var(--color-text-inverse)] text-sm tracking-wide">
                EG
              </span>
              <span className="text-[var(--color-text-primary)] font-semibold text-lg tracking-tight">
                Elgaa<span className="text-[var(--color-brand)]"> Real Estate</span>
              </span>
            </Link>

            {/* Agent pill */}
            <div className="inline-flex items-center gap-1.5 bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 rounded-full px-3 py-1 mb-4">
              <AgentIcon />
              <span className="text-xs font-semibold text-[var(--color-brand)] tracking-wide uppercase">Agent Registration</span>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                Join as an Agent
              </h1>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                List properties, manage leads, and grow your business on Elgaa.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-[var(--radius-md)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <ErrorIcon />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {/* Full name */}
              <Field label="Full name" htmlFor="reg-name">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true"><UserIcon /></span>
                  <input id="reg-name" type="text" autoComplete="name" required value={form.name} onChange={set("name")} placeholder="Amara Okafor" className="input-base pl-9" />
                </div>
              </Field>

              {/* Email */}
              <Field label="Email address" htmlFor="reg-email">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true"><MailIcon /></span>
                  <input id="reg-email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} placeholder="you@agency.com" className="input-base pl-9" />
                </div>
              </Field>

              {/* Phone */}
              <Field label="Phone number" htmlFor="reg-phone">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true"><PhoneIcon /></span>
                  <input id="reg-phone" type="tel" autoComplete="tel" required value={form.phone} onChange={set("phone")} placeholder="+234 800 000 0000" className="input-base pl-9" />
                </div>
              </Field>

              {/* Two-col row for agency + license */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Agency / Brokerage" htmlFor="reg-agency">
                  <input id="reg-agency" type="text" required value={form.agencyName} onChange={set("agencyName")} placeholder="Elgaa Premium Realty" className="input-base" />
                </Field>
                <Field label="License number" htmlFor="reg-license">
                  <input id="reg-license" type="text" required value={form.licenseNumber} onChange={set("licenseNumber")} placeholder="RE/XXX/2024/001" className="input-base" />
                </Field>
              </div>

              {/* Password */}
              <Field label="Password" htmlFor="reg-password">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true"><LockIcon /></span>
                  <input
                    id="reg-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Min. 6 characters"
                    className="input-base pl-9 pr-10"
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </Field>

              {/* Confirm password */}
              <Field label="Confirm password" htmlFor="reg-confirm">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true"><LockIcon /></span>
                  <input id="reg-confirm" type={showPw ? "text" : "password"} autoComplete="new-password" required value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat password" className="input-base pl-9" />
                </div>
              </Field>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={set("terms")}
                  className="mt-0.5 w-4 h-4 shrink-0 rounded border border-[var(--color-border)] accent-[var(--color-brand)]"
                />
                <span className="text-sm text-[var(--color-text-secondary)]">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[var(--color-brand)] hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-[var(--color-brand)] hover:underline">Privacy Policy</Link>
                </span>
              </label>

              {/* Submit */}
              <Button type="submit" variant="primary" size="md" className="w-full justify-center mt-1" disabled={loading}>
                {loading ? <><Spinner /> Creating account…</> : "Create Agent Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <span className="text-xs text-[var(--color-text-muted)]">already have an account?</span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>

            <p className="text-center text-sm text-[var(--color-text-secondary)]">
              <Link href="/agent/login" className="font-medium text-[var(--color-brand)] hover:underline">
                Sign in to your agent portal
              </Link>
            </p>

            <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
              <Link href="/" className="hover:text-[var(--color-text-secondary)] transition-colors">
                ← Back to main site
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function AgentIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function UserIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function MailIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}
function PhoneIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 5.61 5.61l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function LockIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function EyeIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
function ErrorIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function Spinner() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
}
