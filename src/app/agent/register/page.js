"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAgentAuth } from "@/context/AgentAuthContext";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateAgencyName,
  validateLicenseNumber,
  validatePassword,
  validateConfirmPassword,
  validateTerms,
  validateRegisterForm,
} from "@/lib/validation/authValidation";

// Map each field to its individual validator so blur can re-check just that field
const FIELD_VALIDATORS = {
  name:            (f) => validateName(f.name),
  email:           (f) => validateEmail(f.email),
  phone:           (f) => validatePhone(f.phone),
  agencyName:      (f) => validateAgencyName(f.agencyName),
  licenseNumber:   (f) => validateLicenseNumber(f.licenseNumber),
  password:        (f) => validatePassword(f.password),
  confirmPassword: (f) => validateConfirmPassword(f.password, f.confirmPassword),
  terms:           (f) => validateTerms(f.terms),
};

export default function AgentRegisterPage() {
  const router = useRouter();
  const { register } = useAgentAuth();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", agencyName: "",
    licenseNumber: "", password: "", confirmPassword: "", terms: false,
  });
  const [showPw,      setShowPw]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [serverError, setServerError] = useState("");
  const [touched,     setTouched]     = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const updateField = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    // Re-validate on change only if the field was already touched
    if (touched[key]) {
      const err = FIELD_VALIDATORS[key]?.(next);
      setFieldErrors((prev) => ({ ...prev, [key]: err ?? null }));
    }
    // When password changes, also re-check confirmPassword if touched
    if (key === "password" && touched.confirmPassword) {
      const err = validateConfirmPassword(value, next.confirmPassword);
      setFieldErrors((prev) => ({ ...prev, confirmPassword: err ?? null }));
    }
  };

  const set = (key) => (e) =>
    updateField(key, e.target.type === "checkbox" ? e.target.checked : e.target.value);

  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const err = FIELD_VALIDATORS[key]?.(form);
    setFieldErrors((prev) => ({ ...prev, [key]: err ?? null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Touch all fields and run full validation
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validateRegisterForm(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const result = await register(form);
    setLoading(false);

    if (result.ok) {
      router.push("/agent/dashboard");
    } else {
      setServerError(result.error || "Registration failed. Please try again.");
    }
  };

  // Helper to render a field error message
  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p role="alert" className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
        <InlineErrorIcon /> {fieldErrors[name]}
      </p>
    ) : null;

  // Error border class
  const errBorder = (name) =>
    fieldErrors[name] ? "input-error" : "";

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 bg-[var(--color-surface-1)]">
      <Container>
        <div className="mx-auto w-full max-w-lg">
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

            {/* Server error banner */}
            {serverError && (
              <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-[var(--radius-md)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <ErrorIcon />
                {serverError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* Full name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-name" className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Full name
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true"><UserIcon /></span>
                  <input
                    id="reg-name" type="text" autoComplete="name"
                    value={form.name} onChange={set("name")} onBlur={() => handleBlur("name")}
                    placeholder="Amara Okafor"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? "reg-name-error" : undefined}
                    className={`input-base pl-9 ${errBorder("name")}`}
                  />
                </div>
                <FieldError name="name" />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-email" className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Email address
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true"><MailIcon /></span>
                  <input
                    id="reg-email" type="email" autoComplete="email"
                    value={form.email} onChange={set("email")} onBlur={() => handleBlur("email")}
                    placeholder="you@agency.com"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "reg-email-error" : undefined}
                    className={`input-base pl-9 ${errBorder("email")}`}
                  />
                </div>
                <FieldError name="email" />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-phone" className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Phone number
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true"><PhoneIcon /></span>
                  <input
                    id="reg-phone" type="tel" autoComplete="tel"
                    value={form.phone} onChange={set("phone")} onBlur={() => handleBlur("phone")}
                    placeholder="+234 800 000 0000"
                    aria-invalid={!!fieldErrors.phone}
                    aria-describedby={fieldErrors.phone ? "reg-phone-error" : undefined}
                    className={`input-base pl-9 ${errBorder("phone")}`}
                  />
                </div>
                <FieldError name="phone" />
              </div>

              {/* Agency + License row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-agency" className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                    Agency / Brokerage
                  </label>
                  <input
                    id="reg-agency" type="text"
                    value={form.agencyName} onChange={set("agencyName")} onBlur={() => handleBlur("agencyName")}
                    placeholder="Elgaa Premium Realty"
                    aria-invalid={!!fieldErrors.agencyName}
                    className={`input-base ${errBorder("agencyName")}`}
                  />
                  <FieldError name="agencyName" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-license" className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                    License number
                  </label>
                  <input
                    id="reg-license" type="text"
                    value={form.licenseNumber} onChange={set("licenseNumber")} onBlur={() => handleBlur("licenseNumber")}
                    placeholder="RE/XXX/2024/001"
                    aria-invalid={!!fieldErrors.licenseNumber}
                    className={`input-base ${errBorder("licenseNumber")}`}
                  />
                  <FieldError name="licenseNumber" />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-password" className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true"><LockIcon /></span>
                  <input
                    id="reg-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password} onChange={set("password")} onBlur={() => handleBlur("password")}
                    placeholder="Min. 6 characters"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "reg-password-error" : undefined}
                    className={`input-base pl-9 pr-10 ${errBorder("password")}`}
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <FieldError name="password" />
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-confirm" className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Confirm password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true"><LockIcon /></span>
                  <input
                    id="reg-confirm"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirmPassword} onChange={set("confirmPassword")} onBlur={() => handleBlur("confirmPassword")}
                    placeholder="Repeat password"
                    aria-invalid={!!fieldErrors.confirmPassword}
                    aria-describedby={fieldErrors.confirmPassword ? "reg-confirm-error" : undefined}
                    className={`input-base pl-9 ${errBorder("confirmPassword")}`}
                  />
                </div>
                <FieldError name="confirmPassword" />
              </div>

              {/* Terms */}
              <div className="flex flex-col gap-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={set("terms")}
                    onBlur={() => handleBlur("terms")}
                    className="mt-0.5 w-4 h-4 shrink-0 rounded border border-[var(--color-border)] accent-[var(--color-brand)]"
                  />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[var(--color-brand)] hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-[var(--color-brand)] hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                <FieldError name="terms" />
              </div>

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
function InlineErrorIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function Spinner() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
}
