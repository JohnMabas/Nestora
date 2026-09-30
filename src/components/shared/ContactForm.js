"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "property",
    message: "",
  });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const set = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  function validate() {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "Required";
    if (!formData.lastName.trim())  errs.lastName  = "Required";
    if (!formData.email.trim())     errs.email     = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.message.trim())   errs.message   = "Please write your message";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-success-soft)] mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#5fbf6d]" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Message sent!</h3>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Thank you, <strong>{formData.firstName}</strong>. One of our agents will be in touch within 24 hours.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setFormData({ firstName: "", lastName: "", email: "", phone: "", subject: "property", message: "" });
          }}
          variant="outline"
          size="sm"
          className="mt-6"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" id="cf-fname" error={errors.firstName} required>
          <input id="cf-fname" type="text" placeholder="Ada" value={formData.firstName} onChange={set("firstName")}
            className={`input-base ${errors.firstName ? "input-error" : ""}`}
            autoComplete="given-name" aria-required="true" aria-invalid={!!errors.firstName} />
        </Field>
        <Field label="Last Name" id="cf-lname" error={errors.lastName} required>
          <input id="cf-lname" type="text" placeholder="Okonkwo" value={formData.lastName} onChange={set("lastName")}
            className={`input-base ${errors.lastName ? "input-error" : ""}`}
            autoComplete="family-name" aria-required="true" aria-invalid={!!errors.lastName} />
        </Field>
        <Field label="Email Address" id="cf-email" error={errors.email} required>
          <input id="cf-email" type="email" placeholder="ada@example.com" value={formData.email} onChange={set("email")}
            className={`input-base ${errors.email ? "input-error" : ""}`}
            autoComplete="email" aria-required="true" aria-invalid={!!errors.email} />
        </Field>
        <Field label="Phone (optional)" id="cf-phone">
          <input id="cf-phone" type="tel" placeholder="+234 800 000 0000" value={formData.phone} onChange={set("phone")}
            className="input-base" autoComplete="tel" />
        </Field>
      </div>

      <Field label="Subject" id="cf-subject">
        <select id="cf-subject" value={formData.subject} onChange={set("subject")} className="input-base">
          <option value="property">Property Enquiry</option>
          <option value="hotel">Hotel Booking Help</option>
          <option value="agent">Speak to an Agent</option>
          <option value="listing">List My Property</option>
          <option value="partnership">Partnership / Business</option>
          <option value="other">Other</option>
        </select>
      </Field>

      <Field label="Your Message" id="cf-message" error={errors.message} required>
        <textarea
          id="cf-message"
          rows={5}
          placeholder="Tell us what you're looking for or how we can help…"
          value={formData.message}
          onChange={set("message")}
          className={`input-base resize-none ${errors.message ? "input-error" : ""}`}
          aria-required="true"
          aria-invalid={!!errors.message}
        />
      </Field>

      <Button type="submit" variant="primary" size="lg" disabled={loading} className="self-start">
        {loading ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

function Field({ label, id, error, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
        {required && <span className="text-[var(--color-brand)] ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <p role="alert" className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
