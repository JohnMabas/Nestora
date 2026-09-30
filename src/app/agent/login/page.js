"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAgentAuth } from "@/context/AgentAuthContext";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { validateLoginForm } from "@/lib/validation/authValidation";

export default function AgentLoginPage() {
  const router = useRouter();
  const { login } = useAgentAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [serverError, setServerError] = useState("");

  // Track which fields the user has interacted with
  const [touched, setTouched] = useState({ email: false, password: false });
  // Inline field errors — populated on blur and on submit
  const [fieldErrors, setFieldErrors] = useState({});

  // Validate a single field immediately (for blur)
  const validateField = (name, value) => {
    const errs = validateLoginForm({
      email:    name === "email"    ? value : email,
      password: name === "password" ? value : password,
    });
    setFieldErrors((prev) => ({
      ...prev,
      [name]: errs[name] ?? null,
    }));
  };

  const handleBlur = (name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (touched.email) validateField("email", e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (touched.password) validateField("password", e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Mark all fields touched and validate everything
    setTouched({ email: true, password: true });
    const errs = validateLoginForm({ email, password });
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const result = await login(email, password, remember);
    setLoading(false);

    if (result.ok) {
      router.push("/agent/dashboard");
    } else {
      setServerError(result.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 bg-[var(--color-surface-1)]">
      <Container>
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-0)] p-8 shadow-xl shadow-black/20">

            {/* Logo + badge */}
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
              <span className="text-xs font-semibold text-[var(--color-brand)] tracking-wide uppercase">Agent Portal</span>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                Sign in as an Agent
              </h1>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Access your dashboard, listings, and leads.
              </p>
            </div>

            {/* Server error banner */}
            {serverError && (
              <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-[var(--radius-md)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <ErrorIcon />
                {serverError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="agent-email" className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Email address
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true">
                    <MailIcon />
                  </span>
                  <input
                    id="agent-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                    placeholder="you@agency.com"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "agent-email-error" : undefined}
                    className={[
                      "input-base pl-9",
                      fieldErrors.email ? "border-red-500/60 focus:border-red-500" : "",
                    ].join(" ")}
                  />
                </div>
                {fieldErrors.email && (
                  <p id="agent-email-error" role="alert" className="text-xs text-red-400 flex items-center gap-1">
                    <InlineErrorIcon /> {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="agent-password" className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                    Password
                  </label>
                  <Link href="/agent/forgot-password" className="text-xs text-[var(--color-brand)] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true">
                    <LockIcon />
                  </span>
                  <input
                    id="agent-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={(e) => handleBlur("password", e.target.value)}
                    placeholder="••••••••"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "agent-password-error" : undefined}
                    className={[
                      "input-base pl-9 pr-10",
                      fieldErrors.password ? "border-red-500/60 focus:border-red-500" : "",
                    ].join(" ")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="agent-password-error" role="alert" className="text-xs text-red-400 flex items-center gap-1">
                    <InlineErrorIcon /> {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border border-[var(--color-border)] accent-[var(--color-brand)]"
                />
                <span className="text-sm text-[var(--color-text-secondary)]">Remember me on this device</span>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center mt-1"
                disabled={loading}
              >
                {loading ? <><Spinner /> Signing in…</> : "Sign in to Dashboard"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <span className="text-xs text-[var(--color-text-muted)]">or</span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>

            <p className="text-center text-sm text-[var(--color-text-secondary)]">
              Not yet an agent?{" "}
              <Link href="/agent/register" className="font-medium text-[var(--color-brand)] hover:underline">
                Apply to join Elgaa
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

// ─── Icons ────────────────────────────────────────────────────────────────────

function AgentIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function MailIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
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
function InlineErrorIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function Spinner() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
}
