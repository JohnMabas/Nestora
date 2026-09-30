"use client";

import { useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden" aria-label="Contact hero">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-0)] via-[var(--color-surface-0)]/90 to-[var(--color-surface-0)]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-1)] via-transparent to-transparent" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="accent-line" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
                Get In Touch
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-[var(--color-text-primary)] leading-[1.08] sm:text-6xl">
              We&apos;d love to
              <span className="text-[var(--color-brand)]"> hear from you</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
              Whether you have a property enquiry, need help with a hotel booking, or just want to chat about the market — our team is ready to help.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Contact content ──────────────────────────────────── */}
      <section className="section bg-[var(--color-surface-1)]" aria-labelledby="contact-heading">
        <Container>
          <FadeInOnScroll className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* ── Form ─── */}
            <div className="lg:col-span-3">
              <SectionHeading
                eyebrow="Send a Message"
                title="Tell us how we can help"
                subtitle="Fill in the form and one of our agents will respond within 24 hours."
                id="contact-heading"
                className="mb-8"
              />
              <ContactForm />
            </div>

            {/* ── Info sidebar ─── */}
            <aside className="lg:col-span-2 flex flex-col gap-6">
              <InfoCard
                icon={<PhoneIcon />}
                title="Phone"
                lines={["+234 700 ELGAA (35422)", "+234 812 000 0001"]}
                sub="Mon – Fri, 8 am – 6 pm"
              />
              <InfoCard
                icon={<EmailIcon />}
                title="Email"
                lines={["hello@elgaa.ng", "bookings@elgaa.ng"]}
                sub="We reply within 24 hours"
              />
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <LocationIcon className="text-[var(--color-brand)]" />
                  Our Offices
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-brand)] uppercase tracking-wide mb-1">Jos</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">12 Hill Station Road, Jos North</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Plateau State, Nigeria</p>
                  </div>
                  <div className="border-t border-[var(--color-border)] pt-4">
                    <p className="text-xs font-semibold text-[var(--color-brand)] uppercase tracking-wide mb-1">Abuja</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">5 Adetokunbo Ademola Crescent</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Maitama, FCT, Nigeria</p>
                  </div>
                </div>
              </div>

              {/* Office hours */}
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                  <ClockIcon className="text-[var(--color-brand)]" />
                  Office Hours
                </h3>
                <ul className="flex flex-col gap-2 text-sm text-[var(--color-text-secondary)]">
                  {[
                    { day: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
                    { day: "Saturday",         time: "9:00 AM – 3:00 PM" },
                    { day: "Sunday",           time: "Closed" },
                  ].map(({ day, time }) => (
                    <li key={day} className="flex justify-between">
                      <span>{day}</span>
                      <span className={time === "Closed" ? "text-[var(--color-error)]" : "text-[var(--color-text-primary)] font-medium"}>
                        {time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </FadeInOnScroll>
        </Container>
      </section>

      {/* ── Map placeholder ────────────────────────────────── */}
      <section className="pb-24" aria-label="Office location">
        <Container>
          <FadeInOnScroll>
            <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] overflow-hidden">
              <div className="flex items-center justify-center h-72 text-center flex-col gap-3 text-[var(--color-text-muted)]">
                <MapIcon />
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Interactive map coming soon</p>
                <p className="text-xs">12 Hill Station Road, Jos North · 5 Adetokunbo Ademola Crescent, Maitama</p>
              </div>
            </div>
          </FadeInOnScroll>
        </Container>
      </section>
    </div>
  );
}

// ─── Contact Form (client) ──────────────────────────────────────────────────

function ContactForm() {
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
          onClick={() => { setSubmitted(false); setFormData({ firstName: "", lastName: "", email: "", phone: "", subject: "property", message: "" }); }}
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
          <input id="cf-fname" type="text" placeholder="Ada" value={formData.firstName} onChange={set("firstName")} className={`input-base ${errors.firstName ? "input-error" : ""}`} autoComplete="given-name" aria-required="true" aria-invalid={!!errors.firstName} />
        </Field>
        <Field label="Last Name" id="cf-lname" error={errors.lastName} required>
          <input id="cf-lname" type="text" placeholder="Okonkwo" value={formData.lastName} onChange={set("lastName")} className={`input-base ${errors.lastName ? "input-error" : ""}`} autoComplete="family-name" aria-required="true" aria-invalid={!!errors.lastName} />
        </Field>
        <Field label="Email Address" id="cf-email" error={errors.email} required>
          <input id="cf-email" type="email" placeholder="ada@example.com" value={formData.email} onChange={set("email")} className={`input-base ${errors.email ? "input-error" : ""}`} autoComplete="email" aria-required="true" aria-invalid={!!errors.email} />
        </Field>
        <Field label="Phone (optional)" id="cf-phone">
          <input id="cf-phone" type="tel" placeholder="+234 800 000 0000" value={formData.phone} onChange={set("phone")} className="input-base" autoComplete="tel" />
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
        {label}{required && <span className="text-[var(--color-brand)] ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <p role="alert" className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}

function InfoCard({ icon, title, lines, sub }) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
        <span className="text-[var(--color-brand)]">{icon}</span>
        {title}
      </h3>
      {lines.map((line) => (
        <p key={line} className="text-sm text-[var(--color-text-secondary)]">{line}</p>
      ))}
      {sub && <p className="text-xs text-[var(--color-text-muted)] mt-1">{sub}</p>}
    </div>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function PhoneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 5.61 5.61l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function EmailIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
}
function LocationIcon({ className = "" }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function ClockIcon({ className = "" }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
function MapIcon() {
  return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>;
}
