"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateTerms,
  validateBuyerRegisterForm,
} from "@/lib/validation/authValidation";

// Map each field to its individual validator for blur re-validation
const FIELD_VALIDATORS = {
  name:    (f) => validateName(f.name),
  email:   (f) => validateEmail(f.email),
  password:(f) => validatePassword(f.password),
  confirm: (f) => validateConfirmPassword(f.password, f.confirm),
  agreed:  (f) => validateTerms(f.agreed),
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "", agreed: false,
  });
  const [showPw,      setShowPw]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [serverError, setServerError] = useState("");
  const [touched,     setTouched]     = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const updateField = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    // Re-validate on change only if the field has already been touched
    if (touched[key]) {
      const err = FIELD_VALIDATORS[key]?.(next);
      setFieldErrors((prev) => ({ ...prev, [key]: err ?? null }));
    }
    // When password changes, also re-check confirm if it's been touched
    if (key === "password" && touched.confirm) {
      const err = validateConfirmPassword(value, next.confirm);
      setFieldErrors((prev) => ({ ...prev, confirm: err ?? null }));
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
    setTouched({ name: true, email: true, password: true, confirm: true, agreed: true });
    const errs = validateBuyerRegisterForm(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const result = await register(form.name.trim(), form.email.trim(), form.password);
    setLoading(false);

    if (result.ok) {
      router.push("/");
    } else {
      setServerError(result.error || "Registration failed. Please try again.");
    }
  };

  // Password strength indicator
  const strength = (() => {
    if (!form.password) return 0;
    let s = 0;
    if (form.password.length >= 6)  s++;
    if (form.password.length >= 10) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s; // 0–5
  })();
  const strengthLabel = ["", "Very weak", "Weak", "Fair", "Good", "Strong"][strength] || "";
  const strengthColor = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"][strength] || "bg-red-500";

  // Helper: render inline field error
  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p role="alert" className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
        <InlineErrorIcon /> {fieldErrors[name]}
      </p>
    ) : null;

  // Helper: red border when there's a field error
  const errBorder = (name) =>
    fieldErrors[name] ? "input-error" : "";

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-[var(--color-surface-1)]">
      <Container>
        <div className="mx-auto w-full max-w-md">
          {/* Card */}
          <div className="rounded-[var(--radius-2xl)] border-2 border-[var(--color-border)] bg-[var(--color-surface-0)] p-8 shadow-xl shadow-black/20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 mb-8 w-fit" aria-label="Elgaa Real Estate — home">
              <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)] font-bold text-[var(--color-text-inverse)] text-sm tracking-wide">
                EG
              </span>
              <span className="text-[var(--color-text-primary)] font-semibold text-lg tracking-tight">
                Elgaa<span className="text-[var(--color-brand)]"> Real Estate</span>
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                Create your account
              </h1>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Join thousands of property seekers across Jos &amp; Abuja.
              </p>
            </div>

            {/* Server error banner */}
            {serverError && (
              <div
                role="alert"
                className="mb-5 flex items-center gap-2.5 rounded-[var(--radius-md)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
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
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true">
                    <UserIcon />
                  </span>
                  <input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={set("name")}
                    onBlur={() => handleBlur("name")}
                    placeholder="Your full name"
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
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true">
                    <MailIcon />
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={set("email")}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "reg-email-error" : undefined}
                    className={`input-base pl-9 ${errBorder("email")}`}
                  />
                </div>
                <FieldError name="email" />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-password" className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true">
                    <LockIcon />
                  </span>
                  <input
                    id="reg-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={set("password")}
                    onBlur={() => handleBlur("password")}
                    placeholder="Min. 6 characters"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "reg-password-error" : undefined}
                    className={`input-base pl-9 pr-10 ${errBorder("password")}`}
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
                <FieldError name="password" />
                {/* Strength bar — only shown when something's been typed */}
                {form.password && (
                  <div className="mt-1 flex flex-col gap-1">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          className={[
                            "flex-1 rounded-full transition-all duration-300",
                            n <= strength ? strengthColor : "bg-[var(--color-border)]",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Strength:{" "}
                      <span className="font-medium text-[var(--color-text-secondary)]">{strengthLabel}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-confirm" className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                  Confirm password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true">
                    <LockIcon />
                  </span>
                  <input
                    id="reg-confirm"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={set("confirm")}
                    onBlur={() => handleBlur("confirm")}
                    placeholder="Repeat your password"
                    aria-invalid={!!fieldErrors.confirm}
                    aria-describedby={fieldErrors.confirm ? "reg-confirm-error" : undefined}
                    className={`input-base pl-9 ${errBorder("confirm")}`}
                  />
                  {/* Green check when passwords match and both are non-empty */}
                  {form.confirm && !fieldErrors.confirm && form.password === form.confirm && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" aria-label="Passwords match">
                      <CheckIcon />
                    </span>
                  )}
                </div>
                <FieldError name="confirm" />
              </div>

              {/* Terms */}
              <div className="flex flex-col gap-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    id="reg-terms"
                    type="checkbox"
                    checked={form.agreed}
                    onChange={set("agreed")}
                    onBlur={() => handleBlur("agreed")}
                    aria-invalid={!!fieldErrors.agreed}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--color-border)] bg-[var(--color-surface-2)] accent-[var(--color-brand)] cursor-pointer"
                  />
                  <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[var(--color-brand)] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[var(--color-brand)] hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                <FieldError name="agreed" />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner />
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <span className="text-xs text-[var(--color-text-muted)]">or</span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-[var(--color-text-secondary)]">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[var(--color-brand)] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function InlineErrorIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
